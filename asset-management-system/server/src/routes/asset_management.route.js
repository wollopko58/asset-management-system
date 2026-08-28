const express = require("express");
const router = express.Router();

const assetManagementController = require("../controllers/asset_management.controller");
const {
  validateCreateAssetManagement,
  validateUpdateAssetManagement,
  validateDeleteAssetManagement,
  validateGetAssetManagementById,
} = require("../validators/asset_management.validator");

router.get("/", assetManagementController.getAssetManagements);
router.get(
  "/:id",
  validateGetAssetManagementById,
  assetManagementController.getAssetManagementById,
);
router.post(
  "/",
  validateCreateAssetManagement,
  assetManagementController.createAssetManagement,
);
router.patch(
  "/:id",
  validateUpdateAssetManagement,
  assetManagementController.updateAssetManagement,
);
router.delete(
  "/:id",
  validateDeleteAssetManagement,
  assetManagementController.deleteAssetManagement,
);

module.exports = router;
