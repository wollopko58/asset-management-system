const { pool } = require("../config/database");

const create = async (userId, token, expiresAt) => {
  const [result] = await pool.query(
    `INSERT INTO refresh_tokens
        (user_id, token, expires_at)
     VALUES (?, ?, ?)`,
    [userId, token, expiresAt],
  );

  return result.insertId;
};

const findByToken = async (token) => {
  const [rows] = await pool.query(
    `SELECT id,
            user_id,
            token,
            expires_at
     FROM refresh_tokens
     WHERE token = ?`,
    [token],
  );

  return rows[0];
};

const deleteByToken = async (token) => {
  const [result] = await pool.query(
    `DELETE FROM refresh_tokens
     WHERE token = ?`,
    [token],
  );

  return result.affectedRows;
};

module.exports = {
  create,
  findByToken,
  deleteByToken,
};
