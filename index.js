import express from "express";
import { engine } from "express-handlebars";
import "dotenv/config";
import db from "./db/db.js";
import session from "express-session";
import connect from "connect-session-sequelize";
import authRouter from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 3002; //Heroku || localhost port number

// Set up session middleware
const SequelizeStore = connect(session.Store);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new SequelizeStore({
      db: db,
    }),
    resave: false,
    proxy: true,
    cookie: {
      // Expires in one hour.
      maxAge: 1000 * 60 * 60,
    },
    saveUninitialized: false,
  })
);

app.use(express.json());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

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

// API Routes:
app.use("/api/auth", authRouter);

app.listen(PORT, () => console.log("server running on port " + PORT));
