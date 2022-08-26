import { DataTypes } from "sequelize";
import db from "../db/db.js";
import Match from "./match.js";
import Participant from "./participant.js";

const MatchParticipants = db.define("match_participants", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  isWinner: {
    type: DataTypes.BOOLEAN,
  },
});

Participant.belongsToMany(Match, {
  through: MatchParticipants,
  as: "participants",
  foreignKey: "participantId",
});

Match.belongsToMany(Participant, {
  through: MatchParticipants,
  as: "matches",
  foreignKey: "matchId",
});

export default MatchParticipants;
