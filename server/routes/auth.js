const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Remove mock user data as we're using real database now

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide both email and password" 
      })
    }

    // Find user by email
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    )

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ 
      success: false, 
      message: "An error occurred while logging in" 
    })
  }
})

// Register route
router.post("/register", async (req, res) => {
  try {
    console.log('\n=== Registration Request ===');
    console.log('Request body:', req.body);
    
    const { name, email, password, role } = req.body

    // Validate input
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name, email, password });
      return res.status(400).json({ 
        success: false, 
        message: "Please provide name, email, and password" 
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ 
        success: false, 
        message: "Please provide a valid email address" 
      })
    }

    // Validate password strength
    if (password.length < 6) {
      console.log('Password too short:', password.length);
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 6 characters long" 
      })
    }

    // Check if user already exists
    console.log('Checking for existing user with email:', email);
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log('User already exists:', existingUser);
      return res.status(400).json({ 
        success: false, 
        message: "User with this email already exists" 
      })
    }

    // Validate role
    if (role && !['student', 'teacher'].includes(role)) {
      console.log('Invalid role:', role);
      return res.status(400).json({ 
        success: false, 
        message: "Invalid role specified" 
      })
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    console.log('Creating new user...');
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "student", // Default to student if role not specified
    })

    console.log('Saving user to database...');
    await user.save()
    console.log('User saved successfully:', user);

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    )

    console.log('Registration successful!');
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    console.error("Error stack:", error.stack)
    res.status(500).json({ 
      success: false, 
      message: "An error occurred while registering",
      error: error.message 
    })
  }
})

// Get current user route
router.get("/me", async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Get user from database
    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      })
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token" 
      })
    }
    res.status(500).json({ 
      success: false, 
      message: "An error occurred while getting user information" 
    })
  }
})

module.exports = router

