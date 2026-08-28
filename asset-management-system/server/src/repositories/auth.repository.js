const { pool } = require("../config/database");

const findByUsername = async (username) => {
  const [rows] = await pool.query(
    `SELECT
            id,
            username,
            password_hash,
            name,
            role,
            status
        FROM users
        WHERE username = ?`,
    [username],
  );

  return rows[0];
};

const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT
            id,
            username,
            name,
            role,
            status
        FROM users
        WHERE id = ?`,
    [id],
  );

  return rows[0];
};

module.exports = {
  findByUsername,
  findById,
};
