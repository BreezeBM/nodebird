require("dotenv").config();

const development = {
  username: process.env.DB_USER,
  password: process.env.DB_PSWD,
  database: process.env.DB_NAME,
  host: "localhost",
  dialect: "mysql",
};

const production = {
  username: "",
  password: "",
  database: "",
  host: "localhost",
  dialect: "mysql",
};

const test = {
  username: process.env.DB_USER,
  password: process.env.DB_PSWD,
  database: process.env.TEST_DB_NAME,
  host: "localhost",
  dialect: "mysql",
  logging: false,
};

module.exports = { development, production, test };
