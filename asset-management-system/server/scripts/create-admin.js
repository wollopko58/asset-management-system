const bcrypt = require("bcrypt");

const password = "123456";

const createHash = async () => {
  const passwordHash = await bcrypt.hash(password, 10);

  console.log(passwordHash);
};

createHash();

// How to run: node scripts/create-admin.js

//Example query
// INSERT INTO users
// (username, password_hash, name, role, status)
// VALUES (
//     'admin',
//     '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//     'Administrator',
//     'ADMIN',
//     1
// );
