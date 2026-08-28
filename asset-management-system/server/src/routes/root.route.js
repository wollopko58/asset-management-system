const express = require("express");

const router = express.Router();

const departmentRoute = require("./department.route");
const assetTypeRoute = require("./asset_type.route");
const assetManagementRoute = require("./asset_management.route");
const repairsHistoryRoute = require("./repairs_history.route");
const authRoute = require("./auth.route");
const assetHistoryRoute = require("./asset_history.route");
const notificationRoutes = require("./notification.route");

const auth = require("../middleware/auth");

// Public
router.use("/auth", authRoute);

// Protected
router.use(auth);

router.use("/departments", departmentRoute);
router.use("/asset-types", assetTypeRoute);
router.use("/asset-managements", assetManagementRoute);
router.use("/repairs-history", repairsHistoryRoute);
router.use("/asset-history", assetHistoryRoute);
router.use("/notifications", notificationRoutes);

module.exports = router;
