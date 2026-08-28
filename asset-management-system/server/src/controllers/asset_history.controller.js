const assetHistoryService = require("../services/asset_history.service");
const { sendSuccess } = require("../utils/response");

const getAssetHistory = async (req, res, next) => {
  try {
    const assetHistory = await assetHistoryService.getAssetHistory();

    sendSuccess(res, assetHistory, "Asset History Retrieving Successfully");
  } catch (error) {
    next(error);
  }
};

const getAssetHistoryById = async (req, res, next) => {
  try {
    const assetHistory = await assetHistoryService.getAssetHistoryById(
      req.params.id,
    );

    sendSuccess(res, assetHistory, "Asset History Retrieving Successfully");
  } catch (error) {
    next(error);
  }
};

const createAssetHistory = async (req, res, next) => {
  try {
    const assetHistory = await assetHistoryService.createAssetHistory(
      req.body,
      req.user.id,
    );

    sendSuccess(res, assetHistory, "Asset History Created Successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssetHistory,
  getAssetHistoryById,
  createAssetHistory,
};
