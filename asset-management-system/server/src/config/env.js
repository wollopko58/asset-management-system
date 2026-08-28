const dotenv = require("dotenv");

dotenv.config();

module.exports = {

  port: Number(process.env.PORT) || 3100,

  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    poolLimit: Number(process.env.DB_POOL_LIMIT) || 10,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },

  cors: {
    origins: process.env.ALLOWED_ORIGINS?.split(",") || [],
  },

};