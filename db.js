import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function inicializarTabela() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS escolhas (
      opcao TEXT PRIMARY KEY,
      quantidade INTEGER NOT NULL
    )
  `);
}
