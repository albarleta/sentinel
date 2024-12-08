import jwt from "jsonwebtoken";
import dotEnv from "dotenv";

dotEnv.config();

export const authenticate = (roles) => {
  return (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    // Get the access token from cookies
    const accessToken = req.cookies.accessToken ?? token;
    if (!accessToken) return res.status(401).send({ message: "Access denied" });

    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET_KEY
      );
      if (!roles.includes(decoded.role)) {
        return res.status(403).send({ message: "Access forbidden" });
      }
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).send({ message: "Invalid token" });
    }
  };
};
