const express = require("express");
const router = express.Router();

const assetHistoryController = require("../controllers/asset_history.controller");
const {
  validateGetAssetHistoryById,
  validateCreateAssetHistory,
} = require("../validators/asset_history.validator");

router.get("/", assetHistoryController.getAssetHistory);
router.get(
  "/:id",
  validateGetAssetHistoryById,
  assetHistoryController.getAssetHistoryById,
);

router.post(
  "/",
  validateCreateAssetHistory,
  assetHistoryController.createAssetHistory,
);

module.exports = router;
