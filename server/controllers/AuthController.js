import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotEnv from "dotenv";

import User from "../models/authModel.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwtHelper.js";
import {
  accessCookieOptions,
  refreshCookieOptions,
} from "../utils/cookieHelper.js";

dotEnv.config();

// Added this because I can't use /register /create-account
export const addAccount = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const newUser = new User({
      name,
      email,
      password,
      role,
      systemAdminId: req.user.id,
    });
    const savedUser = await newUser.save();

    res.status(201).json({ status: "success", data: savedUser });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// Register system admin
export const register = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    status,
    contactInfo,
    groupName,
    systemAdminId,
  } = req.body;

  try {
    if (role === "SystemAdmin" && (!contactInfo || !groupName)) {
      return res.status(400).send({
        message: "Contact info and group name are required for SystemAdmin",
      });
    }

    if ((role === "Manager" || role === "Reviewer") && !systemAdminId) {
      return res.status(400).send({
        message: "SystemAdmin ID is required for Manager and Reviewer",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      status,
      contactInfo: role === "SystemAdmin" ? contactInfo : undefined,
      groupName: role === "SystemAdmin" ? groupName : undefined,
      systemAdminId: role !== "SystemAdmin" ? systemAdminId : undefined,
    });

    await user.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//systemadmin account creation
export const createAccount = async (req, res) => {
  const { name, email, password, role } = req.body;
  const systemAdminId = req.user.id; // The logged-in SystemAdmin's ID

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If a user with the same email exists, return a 400 response with a message
      return res.status(400).send({
        message: "Email is already in use. Please choose a different email.",
      });
    }

    if ((role === "Manager" || role === "Reviewer") && !systemAdminId) {
      return res.status(400).send({
        message: "SystemAdmin ID is required for Manager and Reviewer",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      systemAdminId,
    });

    await user.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Login a user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: "User not found" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(403).send({ message: "Invalid credentials" });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save the refresh token in the database
    user.refreshTokens.push(refreshToken);
    await user.save();

    // Send the access token in the cookies, and the refresh token in an HTTP-only cookie
    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken ?? req.body.refreshToken;

  if (!refreshToken)
    return res.status(401).send({ message: "Refresh token required" });

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );

    // Find the user and verify the token is stored in the database
    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(403).send({ message: "Invalid refresh token" });
    }

    // Generate a new access token
    const accessToken = generateAccessToken(user);

    res.cookie("accessToken", accessToken, accessCookieOptions);

    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(403).send({ message: "Invalid or expired refresh token" });
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken ?? req.body.refreshToken;

  if (!refreshToken)
    return res.status(400).send({ message: "Refresh token required" });

  try {
    // Remove the refresh token from the database
    const user = await User.findOneAndUpdate(
      { refreshTokens: refreshToken },
      { $pull: { refreshTokens: refreshToken } }
    );

    if (!user)
      return res.status(400).send({ message: "Invalid refresh token" });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).send({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const editAccount = async (req, res) => {
  const { accountId } = req.params;
  const { name, email, password, status, role } = req.body;
  const userId = req.user.id; // The logged-in user's ID
  const isSystemAdmin = req.user.role === "SystemAdmin"; // Check if the logged-in user is a SystemAdmin
  const isManagerOrReviewer =
    req.user.role === "Manager" || req.user.role === "Reviewer";

  try {
    // Find the user account (either by accountId or by logged-in user)
    const user = await User.findOne({ _id: accountId });

    if (!user) {
      return res.status(404).send({
        message: "Account not found.",
      });
    }

    // Check if the logged-in user is authorized to edit this account
    if (accountId !== userId && isManagerOrReviewer) {
      // Managers or Reviewers can only edit their own account
      return res.status(403).send({
        message: "You can only edit your own account.",
      });
    }

    // If the logged-in user is not a SystemAdmin, they can only update their own password
    if (!isSystemAdmin && accountId !== userId) {
      // Only allow changing of password for self
      if (!password) {
        return res.status(400).send({
          message: "Password is required to update it.",
        });
      }

      // Hash and update the password
      user.password = await bcrypt.hash(password, 10);
      await user.save();
      return res
        .status(200)
        .send({ message: "Password updated successfully." });
    }

    // Handle fields that can be modified:
    if (name) user.name = name;
    if (email) user.email = email;
    if (status) user.status = status;

    // Only SystemAdmin can update the role
    if (role && isSystemAdmin) {
      if (role === "SystemAdmin") {
        return res.status(400).send({
          message: "Cannot change the role to SystemAdmin.",
        });
      }
      user.role = role; // Only allow SystemAdmin to change role if not 'SystemAdmin'
    }

    // Handle password field (only SystemAdmin can reset passwords for others, users can change their own)
    if (password) {
      // SystemAdmin can reset the password for any user
      if (isSystemAdmin) {
        user.password = await bcrypt.hash(password, 10); // Reset the password
      } else if (accountId === userId) {
        // A user (including SystemAdmin) can change their own password
        user.password = await bcrypt.hash(password, 10); // Hash and update the password
      } else {
        return res.status(403).send({
          message: "Not authorized to change the password.",
        });
      }
    }

    // Save the updated user data
    await user.save();
    res.status(200).send({ message: "Account updated successfully" });
  } catch (err) {
    res.status(500).send({
      message: "Error updating account.",
      error: err.message,
    });
  }
};

// Controller function to get all users belonging to a SystemAdmin
export const getUsersForSystemAdmin = async (req, res) => {
  const systemAdminId = req.user.id; // Get the logged-in SystemAdmin's ID
  const { search } = req.query;

  try {
    // Query for all users that belong to the logged-in SystemAdmin
    let users = await User.find({ systemAdminId });

    if (!users.length) {
      return res
        .status(404)
        .send({ message: "No users found for this SystemAdmin." });
    }

    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      );
    }

    // Return the list of users
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send("Error retrieving users: " + err.message);
  }
};

export const getAllReviewers = async (req, res) => {
  const userId = req.user.id; // logged-in manager

  try {
    // Fetch the logged-in manager's systemAdminId
    const manager = await User.findById(userId).select("systemAdminId");
    if (!manager || !manager.systemAdminId) {
      return res
        .status(403)
        .json({ message: "Unauthorized access. Missing systemAdminId." });
    }

    const managerSystemAdminId = manager.systemAdminId;
    const users = await User.find({
      role: "Reviewer",
      systemAdminId: managerSystemAdminId,
    });
    res.send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const deleteAccount = async (req, res) => {
  const { accountId } = req.params;
  const systemAdminId = req.user.id; // The logged-in SystemAdmin's ID

  try {
    // Find the user account that belongs to the current SystemAdmin
    const user = await User.findOneAndDelete({ _id: accountId, systemAdminId });

    if (!user) {
      return res.status(404).send({
        message: "Account not found or not authorized to edit this account.",
      });
    }

    res
      .status(200)
      .send({ message: "Account deleted successfully", data: user });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
