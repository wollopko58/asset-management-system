const assetTypeService = require("../services/asset_type.service");
const { sendSuccess } = require("../utils/response");

const getAssetTypes = async (req, res, next) => {
    try {
        const assetTypes = await assetTypeService.getAssetTypes();

        sendSuccess(res, assetTypes);
    } catch (error) {
        next(error);
    }
};

const createAssetType = async (req, res, next) => {
    try {
        const assetType = await assetTypeService.createAssetType(req.body);

        sendSuccess(res, assetType, "Asset Type created successfully");
    } catch (error) {
        next(error);
    }
};

const updateAssetType = async (req, res, next) => {
    try {
        const assetType = await assetTypeService.updateAssetType(
                req.params.id,
                req.body
        );

        sendSuccess(res, assetType, "Asset Type updated successfully");
    } catch (error) {
        next(error);
    }
}

const deleteAssetType = async (req, res, next) => {
    try {
        const assetType = await assetTypeService.deleteAssetType(req.params.id);

        sendSuccess(res, assetType, "Asset Type closed successfully");
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAssetTypes,
    createAssetType,
    updateAssetType,
    deleteAssetType
};