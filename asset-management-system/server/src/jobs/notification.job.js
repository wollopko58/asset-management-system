const cron = require("node-cron");
const notificationService = require("../services/notification.service");

const startNotificationJob = () => {
  cron.schedule(
    "0 8 * * *",
    async () => {
      try {
        console.log("[Notification Job] Checking asset age notifications...");

        const result = await notificationService.checkAssetAgeNotifications();

        console.log(
          `[Notification Job] Created ${result.createdCount} notifications`,
        );
      } catch (error) {
        console.error("[Notification Job] Failed:", error);
      }
    },
    {
      timezone: "Asia/Bangkok",
    },
  );

  console.log("[Notification Job] Scheduled: Every day at 08:00 Asia/Bangkok");
};

module.exports = {
  startNotificationJob,
};
