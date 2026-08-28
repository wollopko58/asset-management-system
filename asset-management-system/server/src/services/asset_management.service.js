const assetManagementRepository = require("../repositories/asset_management.repository");
const assetTypeRepository = require("../repositories/asset_type.repository");
const departmentRepository = require("../repositories/department.repository");
const assetHistoryRepository = require("../repositories/asset_history.repository");
const AppError = require("../utils/AppError");
const { pool } = require("../config/database");

const getAssetManagements = async () => {
  const assetManagements = await assetManagementRepository.findAll();

  return assetManagements;
};

const getAssetManagementById = async (id) => {
  const assetManagement = await assetManagementRepository.findById(id);

  if (!assetManagement) {
    throw new AppError("Asset Management not found", 404);
  }

  return assetManagement;
};

const createAssetManagement = async (data) => {
  const existingAssetNo = await assetManagementRepository.findByAssetNo(
    data.asset_no,
  );
  const existingAssetType = await assetTypeRepository.findById(
    data.asset_type_id,
  );
  const existingDepartment = await departmentRepository.findById(
    data.department_id,
  );

  if (existingAssetNo) {
    throw new AppError("Asset No already exists", 409);
  }

  if (!existingAssetType) {
    throw new AppError("Asset Type not found", 404);
  }

  if (!existingDepartment) {
    throw new AppError("Department not found", 404);
  }

  if (data.status === undefined) {
    data.status = "ACTIVE";
  }

  const id = await assetManagementRepository.createAssetManagement(data);

  return {
    id,
    asset_no: data.asset_no,
    asset_name: data.asset_name,
    asset_type_id: data.asset_type_id,
    department_id: data.department_id,
    mac_address: data.mac_address,
    serial_number: data.serial_number,
    processor: data.processor,
    ram: data.ram,
    storage_type: data.storage_type,
    storage_capacity: data.storage_capacity,
    operating_system: data.operating_system,
    os_license: data.os_license,
    microsoft_office: data.microsoft_office,
    office_license: data.office_license,
    acquisition_method: data.acquisition_method,
    fiscal_year: data.fiscal_year,
    responsible_person: data.responsible_person,
    responsible_phone: data.responsible_phone,
    status: data.status,
    note: data.note,
  };
};

const updateAssetManagement = async (id, data, userId) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const assetManagement = await assetManagementRepository.findById(id);

    if (!assetManagement) {
      throw new AppError("Asset Management not found", 404);
    }

    if (data.asset_no !== undefined) {
      const existingAssetNo =
        await assetManagementRepository.findByAssetNoExceptId(
          data.asset_no,
          id,
        );

      if (existingAssetNo) {
        throw new AppError("Asset No already exists", 409);
      }
    }

    if (data.asset_type_id !== undefined) {
      const existingAssetType = await assetTypeRepository.findById(
        data.asset_type_id,
      );

      if (!existingAssetType) {
        throw new AppError("Asset Type not found", 404);
      }
    }

    if (data.department_id !== undefined) {
      const existingDepartment = await departmentRepository.findById(
        data.department_id,
      );

      if (!existingDepartment) {
        throw new AppError("Department not found", 404);
      }
    }

    let departmentChanged = false;
    let responsiblePersonChanged = false;
    let action = null;

    if (data.department_id !== undefined) {
      departmentChanged = assetManagement.department_id !== data.department_id;
    }

    if (data.responsible_person !== undefined) {
      responsiblePersonChanged =
        assetManagement.responsible_person !== data.responsible_person;
    }

    if (departmentChanged) {
      action = "TRANSFER";
    } else if (responsiblePersonChanged) {
      action = "UPDATE";
    }

    await assetManagementRepository.updateAssetManagement(connection, id, data);

    if (departmentChanged || responsiblePersonChanged) {
      await assetHistoryRepository.createAssetHistoryWithConnection(
        connection,
        {
          asset_id: id,
          action,
          old_department_id: assetManagement.department_id,
          new_department_id:
            data.department_id !== undefined
              ? data.department_id
              : assetManagement.department_id,
          old_responsible_person: assetManagement.responsible_person,
          new_responsible_person:
            data.responsible_person !== undefined
              ? data.responsible_person
              : assetManagement.responsible_person,
          changed_by: userId,
        },
      );
    }

    await connection.commit();

    return {
      id: Number(id),
      ...data,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const deleteAssetManagement = async (id) => {
  const assetManagement = await assetManagementRepository.findById(id);

  if (!assetManagement) {
    throw new AppError("Asset Management not found", 404);
  }

  if (assetManagement.status === "DISPOSED") {
    throw new AppError("Asset Management already DISPOSED", 409);
  }

  await assetManagementRepository.deleteAssetManagement(id);

  return {
    id: Number(id),
  };
};

module.exports = {
  getAssetManagements,
  getAssetManagementById,
  createAssetManagement,
  updateAssetManagement,
  deleteAssetManagement,
};
