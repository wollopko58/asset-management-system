const mysql = require("mysql2/promise");
const env = require("./env");

const pool = mysql.createPool({
    host: env.database.host,
    port: env.database.port,
    user: env.database.user,
    password: env.database.password,
    database: env.database.database,

    waitForConnections: true,
    connectionLimit: env.database.poolLimit,
    queueLimit: 0,
});

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();

        console.log("Database connected successfully");

        connection.release();
    } catch (error) {
        console.error("Database connection failed:", error.message);
        throw error;
    }
};

module.exports = {
    pool,
    testConnection,
};