const assetManagementService = require("../services/asset_management.service");
const { sendSuccess } = require("../utils/response");

const getAssetManagements = async (req, res, next) => {
  try {
    const assetManagements = await assetManagementService.getAssetManagements();

    sendSuccess(res, assetManagements);
  } catch (error) {
    next(error);
  }
};

const getAssetManagementById = async (req, res, next) => {
  try {
    const assetManagement = await assetManagementService.getAssetManagementById(
      req.params.id,
    );

    sendSuccess(
      res,
      assetManagement,
      "Asset Management Retrieving Successfully",
    );
  } catch (error) {
    next(error);
  }
};

const createAssetManagement = async (req, res, next) => {
  try {
    const assetManagement = await assetManagementService.createAssetManagement(
      req.body,
    );

    sendSuccess(res, assetManagement, "Asset Management created successfully");
  } catch (error) {
    next(error);
  }
};

const updateAssetManagement = async (req, res, next) => {
  try {
    const assetManagement = await assetManagementService.updateAssetManagement(
      req.params.id,
      req.body,
      req.user.id,
    );

    sendSuccess(res, assetManagement, "Asset Management updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteAssetManagement = async (req, res, next) => {
  try {
    const assetManagement = await assetManagementService.deleteAssetManagement(
      req.params.id,
    );

    sendSuccess(res, assetManagement, "Asset Management disposed successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssetManagements,
  getAssetManagementById,
  createAssetManagement,
  updateAssetManagement,
  deleteAssetManagement,
};
