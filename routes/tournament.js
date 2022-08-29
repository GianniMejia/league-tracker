import User from "../models/user.js";
import Tournament from "../models/tournament.js";
import Participant from "../models/participant.js";
import { Router } from "express";
import Match from "../models/match.js";
import MatchParticipants from "../models/match-participants.js";
import { Sequelize } from "sequelize";

const router = Router();

// Tournaments

router.get("/", async (req, res) => {
  try {
    res.status(200).send({
      tournaments: await Tournament.findAll({
        // order: [["dateCompleted", "ASC"]],
        where: {
          name: Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("name")),
            "LIKE",
            `%${req.query.query}%`
          ),
        },
        limit: 10,
      }),
    });
  } catch (error) {
    res.status(500).send({ message: "Something went wrong." });
    console.log(error);
  }
});

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

    console.log(req.params);

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

// Participants

router.get("/:id/participant", async (req, res) => {
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

router.post("/:id/participant", async (req, res) => {
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
      res.status(400).send({ message: "Please enter a name." });
      return;
    }

    if (await Participant.findOne({ where: { name: req.body.name } })) {
      res.status(400).send({ message: "Name is already taken." });
      return;
    }

    const participant = await Participant.create({
      ...req.body,
      tournamentId: req.params.id,
    });

    res.status(200).send(participant);
  } catch (error) {
    res.status(500).send({ message: "Something went wrong." });
    console.log(error);
  }
});

router.delete("/:id/participant/:participantId", async (req, res) => {
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

    const participant = await Participant.destroy({
      where: { id: req.params.participantId },
    });

    res.status(200).send({ message: "Participant deleted successfully!" });
  } catch (error) {
    res.status(500).send({ message: "Something went wrong." });
    console.log(error);
  }
});

// Matches

router.get("/:id/match", async (req, res) => {
  try {
    res.status(200).send({
      matches: await Match.findAll({
        order: [["dateCompleted", "ASC"]],
        where: { tournamentId: req.params.id },
        include: [{ model: Participant, as: "participants" }],
      }),
    });
  } catch (error) {
    res.status(500).send({ message: "Something went wrong." });
    console.log(error);
  }
});

router.post("/:id/match", async (req, res) => {
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

    if (!req.body.dateCompleted) {
      res.status(400).send({ message: "Please enter a date." });
      return;
    }

    if (req.body.participant1Id == req.body.participant2Id) {
      res.status(400).send({ message: "A participant may not face itself." });
      return;
    }

    if (
      !(await Participant.findOne({
        where: {
          id: req.body.participant1Id,
          tournamentId: req.params.id,
        },
      }))
    ) {
      res
        .status(400)
        .send({ message: "Participant 1 is not part of this tournament." });
      return;
    }

    if (
      !(await Participant.findOne({
        where: {
          id: req.body.participant2Id,
          tournamentId: req.params.id,
        },
      }))
    ) {
      res
        .status(400)
        .send({ message: "Participant 2 is not part of this tournament." });
      return;
    }

    const gmt = new Date(req.body.dateCompleted);
    const match = await Match.create({
      dateCompleted: new Date(gmt.getTime() - gmt.getTimezoneOffset() * 60000),
      tournamentId: req.params.id,
    });

    await MatchParticipants.bulkCreate([
      {
        matchId: match.id,
        participantId: req.body.participant1Id,
      },
      {
        matchId: match.id,
        participantId: req.body.participant2Id,
      },
    ]);

    res.status(200).send({});
  } catch (error) {
    res.status(500).send({ message: "Something went wrong." });
    console.log(error);
  }
});

export default router;
