const { pool } = require("../config/database");

const findAll = async () => {
  const [rows] = await pool.query(
    `SELECT id,
                asset_id,
                action,
                old_department_id,
                new_department_id,
                old_responsible_person,
                new_responsible_person,
                changed_by,
                note
        FROM asset_history
        ORDER BY asset_id ASC`,
  );

  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT id,
                asset_id,
                action,
                old_department_id,
                new_department_id,
                old_responsible_person,
                new_responsible_person,
                changed_by,
                note
        FROM asset_history
        WHERE id = ?`,
    [id],
  );

  return rows[0];
};

const createAssetHistory = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO asset_history (
        asset_id,
        action,
        old_department_id,
        new_department_id,
        old_responsible_person,
        new_responsible_person,
        changed_by,
        note
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.asset_id,
      data.action,
      data.old_department_id,
      data.new_department_id,
      data.old_responsible_person,
      data.new_responsible_person,
      data.changed_by,
      data.note,
    ],
  );

  return result.insertId;
};

const createAssetHistoryWithConnection = async (connection, data) => {
  const [result] = await connection.query(
    `INSERT INTO asset_history (
        asset_id,
        action,
        old_department_id,
        new_department_id,
        old_responsible_person,
        new_responsible_person,
        changed_by,
        note
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.asset_id,
      data.action,
      data.old_department_id,
      data.new_department_id,
      data.old_responsible_person,
      data.new_responsible_person,
      data.changed_by,
      data.note,
    ],
  );

  return result.insertId;
};

module.exports = {
  findAll,
  findById,
  createAssetHistory,
  createAssetHistoryWithConnection,
};
