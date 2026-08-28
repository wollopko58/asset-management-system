const express = require("express");
const router = express.Router();

const assetTypeController = require("../controllers/asset_type.controller");
const { validateCreateAssetType, validateUpdateAssetType, validateDeleteAssetType } = require("../validators/asset_type.validator");

router.get("/", assetTypeController.getAssetTypes);
router.post(
    "/",
    validateCreateAssetType,
    assetTypeController.createAssetType
);
router.patch(
    "/:id",
    validateUpdateAssetType,
    assetTypeController.updateAssetType
);
router.delete(
    "/:id",
    validateDeleteAssetType,
    assetTypeController.deleteAssetType
);

module.exports = router;