import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  try {
    const client = await pool.connect();

    const heroesQuery = client.query('SELECT * FROM heroes');
    const ratesQuery = client.query('SELECT * FROM rates');
    const matchupsQuery = client.query('SELECT hero_id, rank, role, herovs FROM matchups');

    const [heroesResult, ratesResult, matchupsResult] = await Promise.all([
      heroesQuery,
      ratesQuery,
      matchupsQuery,
    ]);

    client.release();

    res.status(200).json({
      heroes: heroesResult.rows,
      rates: ratesResult.rows,
      matchups: matchupsResult.rows,
    });
  } catch (error) {
    console.error('Error fetching tier list data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
