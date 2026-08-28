const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notification.controller");

router.get("/", notificationController.getNotifications);
router.post(
  "/check-asset-age",
  notificationController.checkAssetAgeNotifications,
);
router.patch("/:id/read", notificationController.markNotificationAsRead);

module.exports = router;
