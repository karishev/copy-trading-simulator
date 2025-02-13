import express from "express";
import { checkAuth } from "../controllers/authMiddleware.js";
import {
  registerUser,
  logoutUser,
  checkLoggedIn,
  validateToken
} from "../controllers/authController.js";
import { getUser } from "../controllers/userController.js";
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/userModel.js';  // Make sure to import your User model
import bcrypt from 'bcrypt';  // For password comparison

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Send response
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        // Add other user fields you want to send to client
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({
      success: false,
      message: 'Login failed',
      errors: error.errors
    });
  }
});

router.get("/logout", logoutUser);
router.get("/isLoggedIn", checkLoggedIn);
router.post("/validate", validateToken);

router.get("/user", authenticateToken, async (req, res) => {
  try {
    // req.user is set by authenticateToken middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
