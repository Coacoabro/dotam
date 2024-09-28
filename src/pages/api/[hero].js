import { Pool } from 'pg';
import dota2heroes from '../../../json/dota2heroes.json'
import Patches from '../../../json/Patches.json'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  const { hero } = req.query
  const { type } = req.query
  const { patch } = req.query

  const findPatch = Patches.find(p => p.Patch === patch)
  const current_patch = findPatch ? findPatch.dName : null
  const buildsquery = `SELECT * FROM ${current_patch} WHERE hero_id = $1`

  try {
    const heroData = dota2heroes.find(h => h.url === hero);

    if (!heroData) {
      return res.status(404).json({ error: 'Hero not found' });
    }

    const client = await pool.connect();
    let result;

    switch (type) {
      case 'info':
        result = await client.query('SELECT * FROM heroes WHERE hero_id = $1', [heroData.id]);
        break;
      case 'builds':
        result = await client.query('SELECT * FROM builds WHERE hero_id = $1', [heroData.id]);
        // change result to this:
        // result = await client.query(buildsquery, [heroData.id])
        break;
      case 'rates':
        result = await client.query('SELECT * FROM rates WHERE hero_id = $1', [heroData.id]);
        break;
      case 'matchups':
        result = await client.query('SELECT * FROM matchups WHERE hero_id = $1', [heroData.id]);
        break;
      default:
        return res.status(400).json({ error: 'Invalid type parameter' });
    }

    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
