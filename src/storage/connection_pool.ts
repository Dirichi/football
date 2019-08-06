import { Pool } from "pg";
let pool: Pool = null;

export function getConnectionPool(): Pool {
  if (!pool) {
    pool = new Pool();
    pool.connect();
  }

  return pool;
}
