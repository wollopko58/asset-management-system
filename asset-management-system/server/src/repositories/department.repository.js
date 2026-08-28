const { pool } = require("../config/database");

const findAll = async () => {
    const [rows] = await pool.query(`
        SELECT
            id,
            department_name,
            status,
            created_at,
            updated_at
        FROM departments
        ORDER BY department_name ASC
    `);

    return rows;
};

const findByCode = async (departmentCode) => {
    const [rows] = await pool.query(
        `SELECT id
         FROM departments
         WHERE department_code = ?`,
        [departmentCode]
    );

    return rows[0];
};

const createDepartment = async (data) => {
    const [result] = await pool.query(
        `INSERT INTO departments
        (department_code, department_name)
        VALUES (?, ?)`,
        [
            data.department_code,
            data.department_name,
        ]
    );

    return result.insertId;
};

const findByCodeExceptId = async (departmentCode, id) => {
    const [rows] = await pool.query(
        `SELECT id
         FROM departments
         WHERE id != ?
           AND department_code = ?`,
        [id, departmentCode]
    );

    return rows[0];
};

const findById = async (id) => {
    const [rows] = await pool.query(
        `SELECT
            id,
            department_code,
            department_name,
            status
         FROM departments
         WHERE id = ?`,
        [id]
    );

    return rows[0];
};

const updateDepartment = async (id, data) => {
    const fields = [];
    const values = [];

    if (data.department_code !== undefined) {
        fields.push("department_code = ?");
        values.push(data.department_code);
    }

    if (data.department_name !== undefined) {
        fields.push("department_name = ?");
        values.push(data.department_name);
    }

    if (data.status !== undefined) {
        fields.push("status = ?");
        values.push(data.status);
    }

    values.push(id);

    const [result] = await pool.query(
        `UPDATE departments
         SET ${fields.join(", ")}
         WHERE id = ?`,
        values
    );

    return result;
};

const deleteDepartment = async (id) => {
    const [result] = await pool.query(
        `UPDATE departments SET
                            status = 0
         WHERE id = ?`,
        [id]
    );

    return result.affectedRows;
};

module.exports = {
    findAll,
    findByCode,
    createDepartment,
    findByCodeExceptId,
    findById,
    updateDepartment,
    deleteDepartment,
};