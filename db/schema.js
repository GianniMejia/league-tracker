import db from "./db.js";
import User from "../models/user.js";
import Tournament from "../models/tournament.js";
import Match from "../models/match.js";
import Participant from "../models/participant.js";

(async () => {
  await db.sync({ alter: true });
})();
