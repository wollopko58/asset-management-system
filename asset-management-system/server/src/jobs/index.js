const { startNotificationJob } = require("./notification.job");

const startJobs = () => {
  startNotificationJob();
};

module.exports = {
  startJobs,
};
