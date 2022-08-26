import { DataTypes } from "sequelize";
import db from "../db/db.js";

const Match = db.define("match", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  dateCompleted: {
    type: DataTypes.DATE,
  },
});

export default Match;
