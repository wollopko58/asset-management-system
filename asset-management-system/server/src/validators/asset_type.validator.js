const validStatuses = [0, 1];

const validateCreateAssetType = (req, res, next) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Invalid input",
        });
    }

    next();
};

const validateUpdateAssetType = (req, res, next) => {
    const { id } = req.params;
    const {
        name,
        description,
        status
    } = req.body;

    const assetTypeId = Number(id);

    if (Number.isNaN(assetTypeId) || assetTypeId <= 0) {
        return res.status(400).json({
            message: "Invalid Id",
        });
    }

    if (
        name === undefined &&
        description === undefined &&
        status === undefined
    ) {
        return res.status(400).json({
            message: "No data to update",
        });
    }

    if (
        status !== undefined &&
        !validStatuses.includes(status)
    ) {
        return res.status(400).json({
            message: "Invalid status",
        });
    }

    next();
};

const validateDeleteAssetType = (req, res, next) => {
    const { id } = req.params;
    const assetTypeId = Number(id);

    if (Number.isNaN(assetTypeId) || assetTypeId <= 0) {
        return res.status(400).json({
            message: "Invalid Id",
        });
    }

    next();
};

module.exports = {
    validateCreateAssetType,
    validateUpdateAssetType,
    validateDeleteAssetType
};