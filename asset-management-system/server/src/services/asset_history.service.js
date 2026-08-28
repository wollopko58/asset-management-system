const assetHistoryRepository = require("../repositories/asset_history.repository");
const assetManagementReposiroty = require("../repositories/asset_management.repository");
const departmentRepository = require("../repositories/department.repository");
const AppError = require("../utils/AppError");

const getAssetHistory = async () => {
  const assetHistory = await assetHistoryRepository.findAll();

  return assetHistory;
};

const getAssetHistoryById = async (id) => {
  const assetHistory = await assetHistoryRepository.findById(id);

  if (!assetHistory) {
    throw new AppError("Asset History not found", 404);
  }

  return assetHistory;
};

const createAssetHistory = async (data, userId) => {
  const existingAssetManagement = await assetManagementReposiroty.findById(
    data.asset_id,
  );

  if (!existingAssetManagement) {
    throw new AppError("Asset Management not found", 404);
  }

  if (data.old_department_id !== undefined && data.old_department_id !== null) {
    const existingOldDepartment = await departmentRepository.findById(
      data.old_department_id,
    );

    if (!existingOldDepartment) {
      throw new AppError("Old Department not found", 404);
    }
  }

  if (data.new_department_id !== undefined && data.new_department_id !== null) {
    const existingNewDepartment = await departmentRepository.findById(
      data.new_department_id,
    );

    if (!existingNewDepartment) {
      throw new AppError("New Department not found", 404);
    }
  }

  const assetHistory = await assetHistoryRepository.createAssetHistory({
    ...data,
    changed_by: userId,
  });

  return assetHistory;
};

module.exports = {
  getAssetHistory,
  getAssetHistoryById,
  createAssetHistory,
};
