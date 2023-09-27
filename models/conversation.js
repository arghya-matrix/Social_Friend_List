const sequelize = require("../db/database");
const { DataTypes } = require("sequelize");

const Conversation = sequelize.define("Conversation", {
  id: {
    type : DataTypes.INTEGER,
    primaryKey : true,
    unique : true,
    autoIncrement: true
  },
  sender_id: {
    type : DataTypes.INTEGER
  },
  receiver_id : {
    type : DataTypes.INTEGER
  },
  message:{
    type : DataTypes.TEXT
  },
  seen:{
    type : DataTypes.BOOLEAN,
    defaultValue : false
  }
});

module.exports = Conversation;