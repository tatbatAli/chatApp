import jwt from "jsonwebtoken";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const verifyJWT = (req, res, next) => {
  const authHeaders =
    req.headers["authorization"] || req.headers["Authorization"];
  const token = authHeaders && authHeaders.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "not token provided" });
  }
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ mgs: "token expired or invalid" });
    }

    req.username = user.username;
    req.email = user.email;
    req.userId = user.userId;
    next();
  });
};

export default verifyJWT;
