const { pool } = require("../config/database");

const findAll = async () => {
    const [rows] = await pool.query(`
        SELECT
            id,
            name,
            description,
            status,
            created_at,
            updated_at
        FROM asset_types
        ORDER BY name ASC
    `);

    return rows;
};

const findByName = async (name) => {
    const [rows] = await pool.query(
        `SELECT id
         FROM asset_types
         WHERE name = ?`,
        [name]
    );

    return rows[0];
};

const createAssetType = async (data) => {
    const [result] = await pool.query(
        `INSERT INTO asset_types
        (name, description)
        VALUES (?, ?)`,
        [
            data.name,
            data.description,
        ]
    );

    return result.insertId;
};

const findByNameExceptId = async (name, id) => {
    const [rows] = await pool.query(
        `SELECT id
         FROM asset_types
         WHERE id != ?
            AND name = ?`,
        [id, name]
    );

    return rows[0];
}

const findById = async (id) => {
    const [rows] = await pool.query(
        `SELECT 
            id,
            name,
            description,
            status
        FROM asset_types
        WHERE id = ?`,
    [id]
    );

    return rows[0];
}

const updateAssetType = async (id, data) => {
    const fields = [];
    const values = [];

    if (data.name !== undefined) {
        fields.push("name = ?");
        values.push(data.name);
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
        `UPDATE asset_types
         SET ${fields.join(", ")}
         WHERE id = ?`,
        values
    );

    return result.affectedRows;
}

const deleteAssetType = async (id) => {
    const [result] = await pool.query(
        `UPDATE asset_types SET
                            status = 0
         WHERE id = ?`,
        [id]
    );

    return result.affectedRows;
};


module.exports = {
    findAll,
    findByName,
    createAssetType,
    findByNameExceptId,
    findById,
    updateAssetType,
    deleteAssetType
};