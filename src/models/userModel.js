const db = require("../config/db");
const bcrypt = require("bcryptjs");

// Create a new user
async function createUser(name, email) {
  const query = "INSERT INTO users (name, email) VALUES (?, ?)";
  const [result] = await db.execute(query, [name, email]);
  return result.insertId;
}

// Get all users
async function getAllUsers() {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    return rows;
  } catch (error) {
    console.error("getAllUsers query error:", error);
    throw error;
  }
}

// Find User by ID
async function findUserById(id) {
  try {
    const query = "SELECT * FROM users WHERE id = ?";
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  } catch (error) {
    console.error("findUserById query error:", error);
    throw error;
  }
}

// Update a user
async function updateUser(id, name, email) {
  const query = "UPDATE users SET name = ?, email = ? WHERE id = ?";
  const [result] = await db.execute(query, [name, email, id]);
  return result.affectedRows > 0;
}

// Delete a user
async function deleteUser(id) {
  const query = "DELETE FROM users WHERE id = ?";
  const [result] = await db.execute(query, [id]);
  return result.affectedRows > 0;
}

// Register User
async function registerUser(name, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  const [result] = await db.execute(query, [name, email, hashedPassword]);
  return result.insertId;
}

// Find User by Email
async function findUserByEmail(email) {
  const query = "SELECT * FROM users WHERE email = ?";
  const [rows] = await db.execute(query, [email]);
  return rows[0];
}

module.exports = {
  createUser,
  getAllUsers,
  findUserById,
  updateUser,
  deleteUser,
  registerUser,
  findUserByEmail,
};
