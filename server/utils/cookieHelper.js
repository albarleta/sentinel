import dotEnv from "dotenv";

dotEnv.config();

export const accessCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Secure flag for production
  sameSite: "None",
  maxAge: 15 * 60 * 1000, // 15 minutes expiry for accessToken
};

export const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Secure flag for production
  sameSite: "None",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry for refreshToken
};
