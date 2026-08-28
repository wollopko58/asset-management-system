const notificationRepository = require("../repositories/notification.repository");
const assetManagementRepository = require("../repositories/asset_management.repository");

const getNotificationsByUserId = async (userId) => {
  return await notificationRepository.findNotificationsByUserId(userId);
};

const formatDate = (date) => {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

const checkAssetAgeNotifications = async () => {
  const assets = await assetManagementRepository.findAssetsForAgeNotification();

  const users = await notificationRepository.findAdminAndDevUsers();

  let createdCount = 0;

  const today = new Date();
  const todayString = formatDate(today);

  for (const asset of assets) {
    const acquisitionDate = new Date(asset.acquisition_date);

    const fiveYearDate = new Date(acquisitionDate);
    fiveYearDate.setFullYear(fiveYearDate.getFullYear() + 5);

    const oneYearBefore = new Date(fiveYearDate);
    oneYearBefore.setFullYear(oneYearBefore.getFullYear() - 1);

    const sixMonthsBefore = new Date(fiveYearDate);
    sixMonthsBefore.setMonth(sixMonthsBefore.getMonth() - 6);

    const twoMonthsBefore = new Date(fiveYearDate);
    twoMonthsBefore.setMonth(twoMonthsBefore.getMonth() - 2);

    const oneYearString = formatDate(oneYearBefore);
    const sixMonthsString = formatDate(sixMonthsBefore);
    const twoMonthsString = formatDate(twoMonthsBefore);

    console.log({
      assetNo: asset.asset_no,
      acquisitionDate: asset.acquisition_date,
      fiveYearDate: formatDate(fiveYearDate),
      todayString,
      oneYearString,
      sixMonthsString,
      twoMonthsString,
    });

    let notificationMessage = null;

    if (todayString === oneYearString) {
      notificationMessage = `ครุภัณฑ์ ${asset.asset_no} จะครบอายุ 5 ปีในอีก 1 ปี`;
    } else if (todayString === sixMonthsString) {
      notificationMessage = `ครุภัณฑ์ ${asset.asset_no} จะครบอายุ 5 ปีในอีก 6 เดือน`;
    } else if (todayString === twoMonthsString) {
      notificationMessage = `ครุภัณฑ์ ${asset.asset_no} จะครบอายุ 5 ปีในอีก 2 เดือน`;
    }

    if (!notificationMessage) {
      continue;
    }

    for (const user of users) {
      const existingNotification =
        await notificationRepository.findNotification(
          user.id,
          "ASSET_AGE",
          notificationMessage,
        );

      if (existingNotification) {
        continue;
      }

      await notificationRepository.createNotification({
        user_id: user.id,
        title: "ครุภัณฑ์ใกล้ครบ 5 ปี",
        message: notificationMessage,
        type: "ASSET_AGE",
        is_read: 0,
      });

      createdCount++;
    }
  }

  return {
    createdCount,
  };
};

const markNotificationAsRead = async (id, userId) => {
  const result = await notificationRepository.markNotificationAsRead(
    id,
    userId,
  );

  if (result.affectedRows === 0) {
    throw new AppError("Notification not found", 404);
  }

  return {
    id: Number(id),
    is_read: 1,
  };
};

module.exports = {
  getNotificationsByUserId,
  checkAssetAgeNotifications,
  markNotificationAsRead,
};
