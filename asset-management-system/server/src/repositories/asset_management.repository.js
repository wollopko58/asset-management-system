const { pool } = require("../config/database");

const findAll = async () => {
  const [rows] = await pool.query(`
        SELECT *
        FROM asset_managements
        ORDER BY asset_no ASC
    `);

  return rows;
};

const findByAssetNo = async (asset_no) => {
  const [rows] = await pool.query(
    `SELECT id
         FROM asset_managements
         WHERE asset_no = ?`,
    [asset_no],
  );

  return rows[0];
};

const createAssetManagement = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO asset_managements(
            asset_no, 
            asset_name, 
            asset_type_id, 
            department_id, 
            mac_address, 
            serial_number, 
            processor, 
            ram, 
            storage_type, 
            storage_capacity, 
            operating_system, 
            os_license, 
            microsoft_office, 
            office_license, 
            acquisition_method, 
            fiscal_year, 
            responsible_person, 
            responsible_phone, 
            status, 
            note)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.asset_no,
      data.asset_name,
      data.asset_type_id,
      data.department_id,
      data.mac_address,
      data.serial_number,
      data.processor,
      data.ram,
      data.storage_type,
      data.storage_capacity,
      data.operating_system,
      data.os_license,
      data.microsoft_office,
      data.office_license,
      data.acquisition_method,
      data.fiscal_year,
      data.responsible_person,
      data.responsible_phone,
      data.status,
      data.note,
    ],
  );

  return result.insertId;
};

const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT *
         FROM asset_managements
         WHERE id = ?`,
    [id],
  );

  return rows[0];
};

const findByAssetNoExceptId = async (asset_no, id) => {
  const [rows] = await pool.query(
    `SELECT id
         FROM asset_managements
         WHERE id != ?
            AND asset_no = ?`,
    [id, asset_no],
  );

  return rows[0];
};

const updateAssetManagement = async (connection, id, data) => {
  const fields = [];
  const values = [];

  if (data.asset_no !== undefined) {
    fields.push("asset_no = ?");
    values.push(data.asset_no);
  }

  if (data.asset_name !== undefined) {
    fields.push("asset_name = ?");
    values.push(data.asset_name);
  }

  if (data.asset_type_id !== undefined) {
    fields.push("asset_type_id = ?");
    values.push(data.asset_type_id);
  }

  if (data.department_id !== undefined) {
    fields.push("department_id = ?");
    values.push(data.department_id);
  }

  if (data.mac_address !== undefined) {
    fields.push("mac_address = ?");
    values.push(data.mac_address);
  }

  if (data.serial_number !== undefined) {
    fields.push("serial_number = ?");
    values.push(data.serial_number);
  }

  if (data.processor !== undefined) {
    fields.push("processor = ?");
    values.push(data.processor);
  }

  if (data.ram !== undefined) {
    fields.push("ram = ?");
    values.push(data.ram);
  }

  if (data.storage_type !== undefined) {
    fields.push("storage_type = ?");
    values.push(data.storage_type);
  }

  if (data.storage_capacity !== undefined) {
    fields.push("storage_capacity = ?");
    values.push(data.storage_capacity);
  }

  if (data.operating_system !== undefined) {
    fields.push("operating_system = ?");
    values.push(data.operating_system);
  }

  if (data.os_license !== undefined) {
    fields.push("os_license = ?");
    values.push(data.os_license);
  }

  if (data.microsoft_office !== undefined) {
    fields.push("microsoft_office = ?");
    values.push(data.microsoft_office);
  }

  if (data.office_license !== undefined) {
    fields.push("office_license = ?");
    values.push(data.office_license);
  }

  if (data.acquisition_method !== undefined) {
    fields.push("acquisition_method = ?");
    values.push(data.acquisition_method);
  }

  if (data.fiscal_year !== undefined) {
    fields.push("fiscal_year = ?");
    values.push(data.fiscal_year);
  }

  if (data.responsible_person !== undefined) {
    fields.push("responsible_person = ?");
    values.push(data.responsible_person);
  }

  if (data.responsible_phone !== undefined) {
    fields.push("responsible_phone = ?");
    values.push(data.responsible_phone);
  }

  if (data.status !== undefined) {
    fields.push("status = ?");
    values.push(data.status);
  }

  if (data.note !== undefined) {
    fields.push("note = ?");
    values.push(data.note);
  }

  values.push(id);

  const [result] = await connection.query(
    `UPDATE asset_managements
         SET ${fields.join(", ")}
         WHERE id = ?`,
    values,
  );

  return result;
};

const findAssetsForAgeNotification = async () => {
  const [rows] = await pool.query(
    `SELECT
       id,
       asset_no,
       asset_name,
       acquisition_date
     FROM asset_managements
     WHERE acquisition_date IS NOT NULL
       AND status != 'broken'`,
  );

  return rows;
};

const deleteAssetManagement = async (id) => {
  const [result] = await pool.query(
    `UPDATE asset_managements SET
                    status = 'DISPOSED'
                WHERE id = ?`,
    [id],
  );

  return result.affectedRows;
};

module.exports = {
  findAll,
  findByAssetNo,
  createAssetManagement,
  findById,
  findByAssetNoExceptId,
  updateAssetManagement,
  findAssetsForAgeNotification,
  deleteAssetManagement,
};
