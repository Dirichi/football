import { Pool } from "pg";
let pool = null;

export function getConnectionPool(): Pool {
  if (!pool) {
    pool = new Pool();
    pool.connect();
  }

  return pool;
}
