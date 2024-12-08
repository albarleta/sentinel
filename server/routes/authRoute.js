import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  editAccount,
  getUsersForSystemAdmin,
  deleteAccount,
  createAccount,
  getAllReviewers,
} from "../controllers/AuthController.js";
// import upload from "../middlewares/multer.js";

//middlewares
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// router.post(
//   "/add-account",
//   authenticate(["SystemAdmin"]),
//   upload.none(),
//   addAccount
// );

//don't use in FE for BE only
router.post("/register", register);
router.post("/create-account", authenticate(["SystemAdmin"]), createAccount);
router.post("/login", login);
router.post("/refresh-token", refreshToken); // For refreshing the access token
router.post("/logout", logout); // For logging out
router.put(
  "/edit-account/:accountId",
  authenticate(["SystemAdmin"]), // Authenticate the request
  editAccount // Controller logic
);
// Route to get all users for a specific SystemAdmin
router.get(
  "/users",
  authenticate(["SystemAdmin"]), // Ensure user is authenticated
  getUsersForSystemAdmin // Controller logic to fetch the users
);

router.get(
  "/reviewers",
  authenticate(["Manager", "Reviewer"]),
  getAllReviewers
);
router.delete(
  "/delete/:accountId",
  authenticate(["SystemAdmin"]), // Ensure user is authenticated
  deleteAccount // Controller logic to fetch the users
);

export default router;
