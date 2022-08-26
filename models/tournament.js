import { DataTypes } from "sequelize";
import db from "../db/db.js";
import User from "./user.js";
import Match from "./match.js";

const Tournament = db.define("Tournament", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  dateStarted: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  managerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});

Tournament.hasMany(Match, {
  as: "matches",
  foreignKey: { name: "tournamentId" },
});

export default Tournament;
