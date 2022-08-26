import bcrypt from "bcrypt";
import db from "./db.js";
import User from "../models/user.js";
import Tournament from "../models/tournament.js";
import Match from "../models/match.js";
import Participant from "../models/participant.js";
import MatchParticipants from "../models/match-participants.js";

(async () => {
  // Clear existing data
  await db.sync({ force: true });

  await User.bulkCreate([
    {
      username: "user1",
      passwordHash: await bcrypt.hash("password123", 1),
    },
  ]);

  await Tournament.bulkCreate([
    {
      name: "2022 Anual Smash Bros Event",
      description: "The biggest Smash Bros tourney on the east coast.",
      dateStarted: new Date(2022, 5, 20),
      managerId: 1,
    },
  ]);

  await Match.bulkCreate([
    {
      dateCompleted: new Date(2022, 5, 21),
      tournamentId: 1,
    },
    {
      dateCompleted: new Date(2022, 5, 22),
      tournamentId: 1,
    },
    {
      dateCompleted: new Date(2022, 5, 23),
      tournamentId: 1,
    },
  ]);

  await Participant.bulkCreate([
    {
      name: "Team A",
    },
    {
      name: "Team B",
    },
    {
      name: "Team C",
    },
    {
      name: "Team D",
    },
  ]);

  await MatchParticipants.bulkCreate([
    {
      matchId: 1,
      participantId: 1, // Team A
      isWinner: true,
    },
    {
      matchId: 1,
      participantId: 2, // Team B
      isWinner: false,
    },

    {
      matchId: 2,
      participantId: 3, // Team C
      isWinner: true,
    },
    {
      matchId: 2,
      participantId: 4, // Team D
      isWinner: false,
    },

    {
      matchId: 3,
      participantId: 1, // Team A
      isWinner: true,
    },
    {
      matchId: 3,
      participantId: 3, // Team C
      isWinner: false,
    },
  ]);
})();
