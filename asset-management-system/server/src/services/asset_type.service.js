const assetTypeRepository = require("../repositories/asset_type.repository");
const AppError = require("../utils/AppError");

const getAssetTypes = async () => {
    const assetTypes = await assetTypeRepository.findAll();

    return assetTypes;
};

const createAssetType = async (data) => {
    const existing = await assetTypeRepository.findByName(
    data.name
);

    if (existing) {
        throw new AppError(
            "Asset type name already exists",
            409
        );
    }
    
    const id = await assetTypeRepository.createAssetType(data);

    return {
        id,
        name: data.name,
        description: data.description,
    };
}

const updateAssetType = async (id, data) => {

    const assetType = await assetTypeRepository.findById(id);

    if (!assetType) {
        throw new AppError(
            "Asset Type not found",
            404
        );
    }

    if (data.name !== undefined) {
        const existing =
            await assetTypeRepository.findByNameExceptId(
                data.name,
                id
            );

        if (existing) {
            throw new AppError(
                "Asset Type name already exists",
                409
            );
        }
    }

    await assetTypeRepository.updateAssetType(id, data);

    return {
        id: Number(id),
        ...data
    };
};

const deleteAssetType = async (id) => {
    const assetType = await assetTypeRepository.findById(id);

    if (!assetType) {
        throw new AppError(
            "Asset Type not found",
            404
        );
    }

    if (assetType.status === 0) {
        throw new AppError(
            "Asset Type already closed",
            409
        );
    }
    
    await assetTypeRepository.deleteAssetType(id);

    return {
        id: Number(id)
    };
}

module.exports = {
    getAssetTypes,
    createAssetType,
    updateAssetType,
    deleteAssetType
};