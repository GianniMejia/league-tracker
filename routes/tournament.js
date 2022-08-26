import User from "../models/user.js";
import Tournament from "../models/tournament.js";
import { Router } from "express";

const router = Router();

router.post("/new", async (req, res) => {
  try {
    if (!req.session.userId) {
      res.redirect("/");
      return;
    }

    if (!req.body.name) {
      res.status(400).send({ message: "Please enter a tournament name." });
      return;
    }

    if (!req.body.description) {
      res
        .status(400)
        .send({ message: "Please enter a description of the tournament." });
      return;
    }

    if (await Tournament.findOne({ where: { name: req.body.name } })) {
      res.status(400).send({ message: "That tournament name is taken." });
      return;
    }

    const user = await Tournament.create({
      ...req.body,
      dateStarted: new Date(),
      managerId: req.session.userId,
    });

    res.redirect("/");
  } catch (error) {
    res.status(500).send({ message: "Something went wrong." });
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    if (req.session.userId) {
      res.redirect("/");
      return;
    }

    if (!req.body.username) {
      res.status(400).send({ message: "Please enter a username." });
      return;
    }

    if (!req.body.password) {
      res.status(400).send({ message: "Please enter a password." });
      return;
    }

    const user = await User.findOne({
      where: { username: req.body.username },
    });

    if (!user) {
      res.status(400).send({ message: "Invalid username/password." });
      return;
    }

    if (!bcrypt.compare(req.body.password, user.passwordHash)) {
      res.status(400).send({ message: "Invalid username/password." });
      return;
    }

    // Save user data in session (log them in)
    req.session.userId = user.id;
    req.session.save();

    res.redirect("/");
  } catch (error) {
    res.status(500).send({ message: "Something went wrong." });
    console.log(error);
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/current-user", async (req, res) => {
  try {
    if (!req.session.userId) {
      res.status(200).send("null");
      return;
    }

    res
      .status(200)
      .send(await User.findOne({ where: { id: req.session.userId } }));
  } catch (error) {
    res.status(500).send({ message: "Something went wrong." });
    console.log(error);
  }
});

export default router;
