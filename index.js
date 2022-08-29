import express from "express";
import { engine } from "express-handlebars";
import "dotenv/config";
import db from "./db/db.js";
import session from "express-session";
import connect from "connect-session-sequelize";
import authRouter from "./routes/auth.js";
import tournamentRouter from "./routes/tournament.js";
import Tournament from "./models/tournament.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import Participant from "./models/participant.js";
import Match from "./models/match.js";
import MatchParticipants from "./models/match-participants.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3002; //Heroku || localhost port number

// Set up session middleware
const SequelizeStore = connect(session.Store);

const store = new SequelizeStore({
  db: db,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: store,
    resave: false,
    proxy: true,
    cookie: {
      // Expires in one hour.
      maxAge: 1000 * 60 * 60,
    },
    saveUninitialized: false,
  })
);

store.sync();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// View Routes:
app.get("/", async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    res
      .status(500)
      .send({ message: "Something went wrong.", details: error.message });
    console.log(error);
  }
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/tournament/new", (req, res) => {
  res.render("new-tournament");
});

app.get("/tournament/:id/update", async (req, res) => {
  res.render("edit-tournament", {
    tournament: await Tournament.findByPk(req.params.id, { raw: true }),
  });
});

app.get("/tournament/:id", async (req, res) => {
  const tournament = (
    await Tournament.findByPk(req.params.id, {
      include: [
        { model: Participant, as: "participants" },
        {
          model: Match,
          as: "matches",
          include: { model: MatchParticipants, as: "participations" },
        },
      ],
    })
  ).get({ plain: true });

  tournament.participants.forEach((participant) => {
    participant.wins = 0;
    participant.losses = 0;
  });

  tournament.matches.reduce((participants, match) => {
    match.participations.forEach((participation) => {
      const id = participation.participantId;
      participants[id] =
        participants[id] || tournament.participants.find((x) => x.id == id);

      participants[id].wins += participation.isWinner;
      participants[id].losses += !participation.isWinner;
    });

    return participants;
  }, {});

  tournament.participants.sort((a, b) => {
    const totalA = a.wins + a.losses;
    const totalB = b.wins + b.losses;

    if (totalA == 0) {
      return 1;
    }

    if (totalB == 0) {
      return -1;
    }

    return (b.wins / totalB || -b.losses) - (a.wins / totalA || -a.losses);
  });

  res.render("tournament", {
    tournament: tournament,
  });
});

// API Routes:
app.use("/api/auth", authRouter);
app.use("/api/tournament", tournamentRouter);

app.listen(PORT, () => console.log("server running on port " + PORT));
