import bcrypt from "bcrypt";
import db from "./db.js";
import User from "../models/user.js";

(async () => {
  await User.bulkCreate([
    {
      username: "user1",
      passwordHash: await bcrypt.hash("password123", 1),
    },
  ]);
})();
