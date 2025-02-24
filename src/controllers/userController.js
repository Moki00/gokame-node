const userModel = require("../models/userModel");

// Create a new user
async function createUser(req, res) {
  const { name, email } = req.body;
  if (!name || !email)
    return res.status(400).json({ message: "Name and email are required" });

  try {
    const userId = await userModel.createUser(name, email);
    res.status(201).json({ id: userId, name, email });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Get all users
async function getAllUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Get user by ID
async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await userModel.getUserById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Update user
async function updateUser(req, res) {
  const { id } = req.params;
  const { name, email } = req.body;
  if (!name || !email)
    return res.status(400).json({ message: "Name and email are required" });

  try {
    const success = await userModel.updateUser(id, name, email);
    if (!success) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Delete user
async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    const success = await userModel.deleteUser(id);
    if (!success) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
