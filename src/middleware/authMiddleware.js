const jwt = require("jsonwebtoken");
const { getDbConnection } = require("../config/db");

exports.authenticate = async (req, res, next) => {
  // ✅ Get the token from Authorization header
  const token = req.headers.authorization?.split(" ")[1];

  // ✅ Check if token exists
  if (!token) {
      return res.status(401).json({ success: false, status: 401, message: "Unauthorized: Token is missing." });
  }

  // ✅ Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
      return res.status(403).json({ success: false, status: 403, message: "Forbidden: Invalid token." });
  }

  // ✅ Attach database connection to the request
  req.practiceDb = await getDbConnection(decoded.database_name);

  return next();
};
