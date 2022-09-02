import express from "express";
import { engine } from "express-handlebars";
import "dotenv/config";
import db from "./db/db.js";
import session from "express-session";
import connect from "connect-session-sequelize";
import authRouter from "./routes/auth.js";
import tournamentRouter, { getTournament } from "./routes/tournament.js";
import Tournament from "./models/tournament.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import User from "./models/user.js";
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
  const user =
    req.session.userId &&
    (await User.findByPk(req.session.userId, { raw: true }));

  const tournament = await getTournament(req.params.id);
  res.render("tournament", {
    tournament: tournament,
    isManager: user && user.id == tournament.managerId,
  });
});

// API Routes:
app.use("/api/auth", authRouter);
app.use("/api/tournament", tournamentRouter);

app.listen(PORT, () => console.log("server running on port " + PORT));
