import User from "../models/user.js";
import Tournament from "../models/tournament.js";
import Participant from "../models/participant.js";
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

    const tournament = await Tournament.create({
      ...req.body,
      dateStarted: new Date(),
      managerId: req.session.userId,
    });

    res.redirect(`/api/tournament/${tournament.id}/update`);
  } catch (error) {
    res.status(500).send({ message: "Something went wrong." });
    console.log(error);
  }
});

router.put("/:id/update", async (req, res) => {
  try {
    if (!req.session.userId) {
      res.status(403).send({ message: "Please login to do that." });
      return;
    }

    if (
      req.session.userId !=
      (await Tournament.findByPk(req.params.id, { raw: true })).managerId
    ) {
      res.status(403).send({ message: "Unauthorized." });
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

    await Tournament.update(
      {
        name: req.body.name,
        description: req.body.description,
      },
      { where: { id: req.params.id } }
    );

    res.send({ message: "Update successful!" });
  } catch (error) {
    res.status(500).send({ message: "Something went wrong." });
    console.log(error);
  }
});

router.get("/:id/participants", async (req, res) => {
  try {
    res.status(200).send({
      participants: await Participant.findAll({
        raw: true,
        order: [["name", "ASC"]],
        where: { tournamentId: req.params.id },
      }),
    });
  } catch (error) {
    res.status(500).send({ message: "Something went wrong." });
    console.log(error);
  }
});

export default router;
