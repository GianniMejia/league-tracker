import { Sequelize } from "sequelize";
import "dotenv/config";

const db = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL)
  : new Sequelize(
      "tournament_tracker",
      process.env.MYSQL_USER,
      process.env.MYSQL_PASSWORD,
      {
        host: "localhost",
        dialect: "mysql",
      }
    );

export default db;
