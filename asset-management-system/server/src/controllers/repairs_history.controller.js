const repairsHistoryService = require("../services/repairs_history.service");
const { sendSuccess } = require("../utils/response");

const getRepairsHistory = async (req, res, next) => {
  try {
    const repairsHistory = await repairsHistoryService.getRepairsHistory();

    sendSuccess(res, repairsHistory);
  } catch (error) {
    next(error);
  }
};

const createRepairsHistory = async (req, res, next) => {
  try {
    const repairsHistory = await repairsHistoryService.createRepairsHistory(
      req.body,
    );

    sendSuccess(res, repairsHistory, "Repairs History created successfully");
  } catch (error) {
    next(error);
  }
};

const updateRepairsHistory = async (req, res, next) => {
  try {
    const repairsHistory = await repairsHistoryService.updateRepairsHistory(
      req.params.id,
      req.body,
    );

    sendSuccess(res, repairsHistory, "Repairs History updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteRepairsHistory = async (req, res, next) => {
  try {
    const repairsHistory = await repairsHistoryService.deleteRepairsHistory(
      req.params.id,
    );

    sendSuccess(res, repairsHistory, "Repairs History cancelled successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRepairsHistory,
  createRepairsHistory,
  updateRepairsHistory,
  deleteRepairsHistory,
};
