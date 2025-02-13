import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const checkAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "fail",
      message: "Token is not valid",
    });
  }
};
