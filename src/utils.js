require("dotenv").config();

const jwt = require("jsonwebtoken");
const APP_SECRET = process.env.APP_SECRET;

function getTokenPayload(token) {
  return jwt.verify(token, APP_SECRET);
}

function getUserId(req, authToken) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        throw new Error("No token found");
      }
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }

  throw new Error("Not authenticated");
}

function signToken(userId) {
  return jwt.sign({ userId }, APP_SECRET);
}

module.exports = {
  getUserId,
  signToken,
};
