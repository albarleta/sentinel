import Notification from "../models/notificationModel.js";

const NotificationController = {
  getNotifications: async (req, res) => {
    try {
      const { userId } = req.params;

      const notifications = await Notification.find({
        reviewerId: userId,
      }).sort({
        createdAt: -1,
      });

      res.status(200).json({ status: "success", data: notifications });
    } catch (error) {
      res.status(500).json({ status: "fail", message: error.message });
    }
  },

  updateNotification: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedNotification = await Notification.findByIdAndUpdate(
        id,
        { isRead: true },
        { new: true }
      );

      res.status(200).json(updatedNotification);
    } catch (error) {
      res.status(500).json({ status: "fail", message: error.message });
    }
  },
};

export default NotificationController;
