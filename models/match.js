import { DataTypes } from "sequelize";
import db from "../db/db.js";
import Participant from "./participant.js";

const Match = db.define("Match", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  dateCompleted: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

Match.hasMany(Participant, {
  as: "participants",
  foreignKey: { name: "matchId" },
});

export default Match;
