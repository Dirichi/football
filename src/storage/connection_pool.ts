import { Pool } from "pg";
import { Logger } from "../utils/logger";
let pool: Pool = null;

export function getConnectionPool(): Pool {
  if (!pool) {
    Logger.log("Connecting to the database.");
    pool = new Pool({
      database: process.env.PGDATABASE,
      host: process.env.PGHOST,
      password: process.env.PGPASSWORD,
      port: parseInt(process.env.PGPORT, 10),
      user: process.env.PGUSER,
    });
    pool.connect().then(() => {
      Logger.log("Successfully connected to the database.");
    }).catch((err) => {
      Logger.log("Encountered errors while connecting to the database.");
      Logger.log(err);
    });
  }

  return pool;
}
