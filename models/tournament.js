import { DataTypes } from "sequelize";
import db from "../db/db.js";
import User from "./user.js";
import Match from "./match.js";
import Participant from "./participant.js";

const Tournament = db.define("tournament", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
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

Tournament.hasMany(Participant, {
  as: "participants",
  foreignKey: { name: "tournamentId" },
});

export default Tournament;
