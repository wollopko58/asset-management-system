const validStatuses = ["ACTIVE", "REPAIR", "BROKEN", "DISPOSED"];

const updateFields = [
  "asset_no",
  "asset_name",
  "asset_type_id",
  "department_id",
  "mac_address",
  "serial_number",
  "processor",
  "ram",
  "storage_type",
  "storage_capacity",
  "operating_system",
  "os_license",
  "microsoft_office",
  "office_license",
  "acquisition_method",
  "fiscal_year",
  "responsible_person",
  "responsible_phone",
  "status",
  "note",
];

const validateGetAssetManagementById = (req, res, next) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid Id",
    });
  }

  next();
};

const validateCreateAssetManagement = (req, res, next) => {
  const {
    asset_no,
    asset_name,
    asset_type_id,
    department_id,
    fiscal_year,
    status,
  } = req.body;

  if (
    !asset_no ||
    !asset_name ||
    asset_type_id == null ||
    department_id == null ||
    fiscal_year == null
  ) {
    return res.status(400).json({
      message: "Invalid input",
    });
  }

  if (status !== undefined && !validStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid status",
    });
  }

  next();
};

const validateUpdateAssetManagement = (req, res, next) => {
  const { id } = req.params;
  const { asset_type_id, department_id, status } = req.body;
  const assetManagementId = Number(id);
  const assetTypeId = Number(asset_type_id);
  const departmentId = Number(department_id);

  if (Number.isNaN(assetManagementId) || assetManagementId <= 0) {
    return res.status(400).json({
      message: "Invalid assetManagementId",
    });
  }

  if (
    asset_type_id !== undefined &&
    (Number.isNaN(assetTypeId) || assetTypeId <= 0)
  ) {
    return res.status(400).json({
      message: "Invalid assetTypeId",
    });
  }

  if (
    department_id !== undefined &&
    (Number.isNaN(departmentId) || departmentId <= 0)
  ) {
    return res.status(400).json({
      message: "Invalid departmentId",
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
      message: "Invalid status",
    });
  }

  next();
};

const validateDeleteAssetManagement = (req, res, next) => {
  const { id } = req.params;
  const assetManagementId = Number(id);

  if (Number.isNaN(assetManagementId) || assetManagementId <= 0) {
    return res.status(400).json({
      message: "Invalid Id",
    });
  }

  next();
};

module.exports = {
  validateGetAssetManagementById,
  validateCreateAssetManagement,
  validateUpdateAssetManagement,
  validateDeleteAssetManagement,
};
