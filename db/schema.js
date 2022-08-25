import db from "./db.js";
import User from "../models/user.js";

(async () => {
  await db.sync({ alter: true });
})();
