const { pool } = require("../config/database");

const findNotificationsByUserId = async (userId) => {
  const [rows] = await pool.query(
    `SELECT
      id,
      user_id,
      title,
      message,
      type,
      is_read,
      created_at
     FROM notifications
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId],
  );

  return rows;
};

const createNotification = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO notifications (
      user_id,
      title,
      message,
      type,
      is_read
    ) VALUES (?, ?, ?, ?, ?)`,
    [data.user_id, data.title, data.message, data.type, data.is_read ?? 0],
  );

  return result.insertId;
};

const findNotification = async (userId, type, message) => {
  const [rows] = await pool.query(
    `SELECT id
     FROM notifications
     WHERE user_id = ?
       AND type = ?
       AND message = ?
     LIMIT 1`,
    [userId, type, message],
  );

  return rows[0] || null;
};

const findAdminAndDevUsers = async () => {
  const [rows] = await pool.query(
    `SELECT id
     FROM users
     WHERE role IN ('admin', 'dev')`,
  );

  return rows;
};

const markNotificationAsRead = async (id, userId) => {
  const [result] = await pool.query(
    `UPDATE notifications
     SET is_read = 1
     WHERE id = ?
       AND user_id = ?`,
    [id, userId],
  );

  return result;
};

module.exports = {
  findNotificationsByUserId,
  createNotification,
  findNotification,
  findAdminAndDevUsers,
  markNotificationAsRead,
};
