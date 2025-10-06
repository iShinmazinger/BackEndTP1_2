const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Conversation = sequelize.define("Conversation", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Users", key: "id" },
    onDelete: "CASCADE",
  },
  role: {
    type: DataTypes.ENUM("user", "assistant"),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

User.hasMany(Conversation, { foreignKey: "userId" });
Conversation.belongsTo(User, { foreignKey: "userId" });

module.exports = Conversation;
