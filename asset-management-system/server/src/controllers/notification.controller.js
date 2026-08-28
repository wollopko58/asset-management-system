const notificationService = require("../services/notification.service");
const { sendSuccess } = require("../utils/response");

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationService.getNotificationsByUserId(
      req.user.id,
    );

    sendSuccess(res, notifications, "Notifications retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const checkAssetAgeNotifications = async (req, res, next) => {
  try {
    const result = await notificationService.checkAssetAgeNotifications();

    sendSuccess(res, result, "Asset age notifications checked successfully");
  } catch (error) {
    next(error);
  }
};

const markNotificationAsRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markNotificationAsRead(
      req.params.id,
      req.user.id,
    );

    sendSuccess(res, notification, "Notification marked as read successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  checkAssetAgeNotifications,
  markNotificationAsRead,
};
