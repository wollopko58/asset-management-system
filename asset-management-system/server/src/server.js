const app = require("./app");
const env = require("./config/env");
const { testConnection } = require("./config/database");
const { startJobs } = require("./jobs");

const startServer = async () => {
  try {
    await testConnection();

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);

      startJobs();
    });
  } catch (error) {
    console.error("Failed to start server");
    process.exit(1);
  }
};

startServer();
