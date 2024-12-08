import { Router } from "express";
import NotificationController from "../controllers/NotificationController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();
router.get("/:userId", NotificationController.getNotifications);
router.patch("/:id", NotificationController.updateNotification);

export default router;
