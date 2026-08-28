const validateGetAssetHistoryById = (req, res, next) => {
  const id = req.params.id;
  const historyId = Number(id);

  if (Number.isNaN(historyId) || historyId <= 0) {
    return res.status(400).json({
      message: "Invalid Id",
    });
  }

  next();
};

const validateCreateAssetHistory = (req, res, next) => {
  const {
    asset_id,
    action,
    old_department_id,
    new_department_id,
    old_responsible_person,
    new_responsible_person,
    note,
  } = req.body;

  if (!asset_id || Number(asset_id) <= 0) {
    return res.status(400).json({
      message: "Invalid asset_id",
    });
  }

  if (!action || typeof action !== "string") {
    return res.status(400).json({
      message: "Action is required",
    });
  }

  if (
    old_department_id !== undefined &&
    old_department_id !== null &&
    Number(old_department_id) <= 0
  ) {
    return res.status(400).json({
      message: "Invalid old_department_id",
    });
  }

  if (
    new_department_id !== undefined &&
    new_department_id !== null &&
    Number(new_department_id) <= 0
  ) {
    return res.status(400).json({
      message: "Invalid new_department_id",
    });
  }

  next();
};

module.exports = {
  validateGetAssetHistoryById,
  validateCreateAssetHistory,
};
