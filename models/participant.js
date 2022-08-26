import { DataTypes } from "sequelize";
import db from "../db/db.js";

const Participant = db.define("Participant", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Participant;
