const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const SECRET_KEY = process.env.JWT_SECRET || "YOUR_JWT_TOKEN";

// Validation for registration
const validateRegister = [
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters."),
  body("email").isEmail().withMessage("Invalid email address."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
];

// Register New User
async function register(request, response) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ message: errors.array()[0].msg });
  }

  const { name, email, password } = request.body;

  try {
    // check if user already exists
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser)
      return response.status(400).json({ message: "Email in database" });

    const userId = await userModel.registerUser(name, email, password);
    response.status(201).json({ id: userId, name, email });
  } catch (error) {
    console.error("Error registering user:", error);
    response.status(500).json({ message: "Server error" });
  }
}

// Validation rules for login
const validateLogin = [
  body("email").isEmail().withMessage("Invalid email address."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
];

// Login User
async function login(request, response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.status(400).json({ message: errors.array()[0].msg });
  }

  const { email, password } = request.body;

  if (!email || !password)
    return response
      .status(400)
      .json({ message: "Email and password are required" });

  try {
    const user = await userModel.findUserByEmail(email);
    if (!user)
      return response.status(401).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return response.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
    response.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    response.status(500).json({ message: "Server error" });
  }
}

module.exports = { validateRegister, validateLogin, register, login };
