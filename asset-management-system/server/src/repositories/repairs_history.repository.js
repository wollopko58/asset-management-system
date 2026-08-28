const { pool } = require("../config/database");

const findAll = async () => {
  const [rows] = await pool.query(
    `SELECT id,
                asset_id,
                ticket_no,
                description,
                status
        FROM repairs_history
        ORDER BY ticket_no ASC`,
  );

  return rows;
};

const findByTicketNo = async (ticket_no) => {
  const [rows] = await pool.query(
    `SELECT id
        FROM repairs_history
        WHERE ticket_no = ?`,
    [ticket_no],
  );

  return rows[0];
};

const createRepairsHistory = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO repairs_history
        (asset_id, ticket_no, description)
        VALUES (?, ?, ?)`,
    [data.asset_id, data.ticket_no, data.description],
  );

  return result.insertId;
};

const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT id
        FROM repairs_history
        WHERE id = ?`,
    [id],
  );

  return rows[0];
};

const findByTicketExceptId = async (ticket_no, id) => {
  const [rows] = await pool.query(
    `SELECT id
        FROM repairs_history
        WHERE id != ?
        AND ticket_no = ?`,
    [id, ticket_no],
  );

  return rows[0];
};

const updateRepairsHistory = async (id, data) => {
  const fields = [];
  const values = [];

  if (data.asset_id !== undefined) {
    fields.push("asset_id = ?");
    values.push(data.asset_id);
  }

  if (data.ticket_no !== undefined) {
    fields.push("ticket_no = ?");
    values.push(data.ticket_no);
  }

  if (data.description !== undefined) {
    fields.push("description = ?");
    values.push(data.description);
  }

  if (data.status !== undefined) {
    fields.push("status = ?");
    values.push(data.status);
  }

  values.push(id);

  const [result] = await pool.query(
    `UPDATE repairs_history 
            SET ${fields.join(", ")}
            WHERE id = ?`,
    values,
  );

  return result;
};

const deleteRepairsHistory = async (id) => {
  const [result] = await pool.query(
    `UPDATE repairs_history SET
                    status = 'CANCELLED'
                    WHERE id = ?`,
    [id],
  );

  return result.affectedRows;
};

module.exports = {
  findAll,
  findByTicketNo,
  createRepairsHistory,
  findById,
  findByTicketExceptId,
  updateRepairsHistory,
  deleteRepairsHistory,
};
