const jwt = require("jsonwebtoken");
const { getDbConnection } = require("../config/db");
require("dotenv").config();

exports.authenticate = async (req, res, next) => {
    try {
        //  Get the token from Authorization header
        const token = req.headers.authorization?.split(" ")[1];

        // Check if token exists
        if (!token) {
            return res.status(401).json({ success: false, status: 401, message: "Unauthorized: Token is missing." });
        }

        //  Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //  Attach database connection to the request
        req.practiceDb = await getDbConnection(decoded.database_name);

        return next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, status: 401, message: "Unauthorized: Token has expired." });
        }
        return res.status(403).json({ success: false, status: 403, message: "Forbidden: Invalid token." });
    }
};



exports.basicAuth = async (req, res, next) => {
  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
      return res.json({ success: false, status_code:401, message: 'Basic auth is required!' })
  }

  const base64Credentials = req.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  if (username === process.env.ADMIN_USER_NAME && password === process.env.ADMIN_PASSWORD) {
      next();
  }
  else {
      return res.json({ success: false, status_code: 401, message: 'Validation failed fro basic auth!' })
  }
};
