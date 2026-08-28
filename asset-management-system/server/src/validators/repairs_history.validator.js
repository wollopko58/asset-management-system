const validStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED", "CANCELLED"];

const updateFields = ["asset_id", "ticket_no", "description", "status"];

const validateCreateRepairsHistory = (req, res, next) => {
  const { asset_id, ticket_no, description, status } = req.body;

  const assetId = Number(asset_id);

  if (!ticket_no || !description) {
    return res.status(400).json({
      message: "Invalid input",
    });
  }

  if (Number.isNaN(assetId) || assetId <= 0) {
    return res.status(400).json({
      message: "Invalid id",
    });
  }

  if (status !== undefined && !validStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid status",
    });
  }

  next();
};

const validateUpdateRepairsHistory = (req, res, next) => {
  const id = req.params.id;
  const { asset_id, ticket_no, description, status } = req.body;
  const repairId = Number(id);
  const assetId = Number(asset_id);

  if (Number.isNaN(repairId) || repairId <= 0) {
    return res.status(400).json({
      message: "Invalid Id",
    });
  }

  if (asset_id !== undefined && (Number.isNaN(assetId) || assetId <= 0)) {
    return res.status(400).json({
      message: "Invalid Input",
    });
  }

  const fields = Object.keys(req.body);

  if (fields.length === 0) {
    return res.status(400).json({
      message: "No data to update",
    });
  }

  const invalidFields = fields.filter((field) => !updateFields.includes(field));

  if (invalidFields.length > 0) {
    return res.status(400).json({
      message: "Invalid field",
    });
  }

  if (status !== undefined && !validStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid Status",
    });
  }

  next();
};

const validateDeleteRepairsHistory = (req, res, next) => {
  const id = req.params.id;
  const repairId = Number(id);

  if (Number.isNaN(repairId) || repairId <= 0) {
    return res.status(400).json({
      message: "Invalid Id",
    });
  }

  next();
};

module.exports = {
  validateCreateRepairsHistory,
  validateUpdateRepairsHistory,
  validateDeleteRepairsHistory,
};
