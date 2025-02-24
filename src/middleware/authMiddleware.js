const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "JWT_TOKEN";

function authenticateToken(request, response, next) {
  const authHeader = request.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return response.status(401).json({ message: "Access denied" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token after "Bearer"

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return response.status(403).json({ message: "Invalid token" });
    }
    request.user = decoded;
    next();
  });
}

module.exports = authenticateToken;
