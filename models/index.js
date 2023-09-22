const sequelize = require("../db/database");
const Sessions = require("./sessions");
const User = require("./user");
const Friend = require("./Friends");

sequelize.sync({ alter: true });

module.exports = {
  sequelize,
  Sessions,
  User,
  Friend
};
