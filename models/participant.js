import { DataTypes } from "sequelize";
import db from "../db/db.js";

const Participant = db.define("participant", {
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
});

export default Participant;
