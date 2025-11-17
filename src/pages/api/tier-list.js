
export default async function handler(req, res) {

  const { patch } = req.query

  try {

    const heroesResult = await fetch(`https://dhpoqm1ofsbx7.cloudfront.net/data/heroes.json`)
    const heroes = await heroesResult.json()
    const ratesResult = await fetch(`https://dhpoqm1ofsbx7.cloudfront.net/data/${patch}/rates.json`)
    const rates = await ratesResult.json()
    const lastModified = ratesResult.headers.get("last-modified")
    const matchupsResult = await fetch(`https://dhpoqm1ofsbx7.cloudfront.net/data/tier-matchups.json`)    
    const matchups = await matchupsResult.json()

    res.status(200).json({
      heroes: heroes,
      rates: rates,
      matchups: matchups,
      modified: lastModified,
    });

  } catch (error) {
    console.error('Error fetching tier list data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
