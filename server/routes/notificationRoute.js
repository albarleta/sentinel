import { Router } from "express";
import NotificationController from "../controllers/NotificationController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();
router.get(
  "/",
  authenticate(["SystemAdmin", "Manager", "Reviewer"]),
  NotificationController.getNotifications
);
router.patch(
  "/:id",
  authenticate(["SystemAdmin", "Manager", "Reviewer"]),
  NotificationController.updateNotification
);

export default router;
