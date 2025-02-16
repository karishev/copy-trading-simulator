import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const errorMessage = (res, error) => {
  return res.status(400).json({ status: "fail", message: error.message });
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password) {
      return res.status(200).json({
        status: "fail",
        message: "Not all fields have been entered",
      });
    }
    if (password.length < 6 || password.length > 25) {
      return res.status(200).json({
        status: "fail",
        message: "Password must be between 6-25 characters",
        type: "password",
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(200).json({
        status: "fail",
        message: "An account with this username already exists.",
        type: "username",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    return errorMessage(res, error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(200).json({
        status: "fail",
        message: "Not all fields have been entered.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        status: "fail",
        message: "Invalid credentials. Please try again.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({
        status: "fail",
        message: "Invalid credentials. Please try again.",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return res.status(200).json({
      token,
      user: {
        email,
        id: user._id,
        balance: user.balance,
      },
    });
  } catch (error) {
    return errorMessage(res, error);
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      status: "success"
    });
  } catch (error) {
    return errorMessage(res, error);
  }
};

export const checkLoggedIn = async (req, res) => {
  try {
    const {token} = req.cookies;
    if (!token) {
      return res.json(false);
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.json(false);
    }

    const user = await User.findById(verified.id);
    if (!user) {
      return res.json(false);
    }

    return res.json(true);
  } catch (error) {
    return res.json(false);
  }
};

export const validateToken = async (req, res) => {
  try {
    const token = req.headers["x-auth-token"];
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (error) {
    return res.json(false);
  }
};
