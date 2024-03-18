import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function getServerSideProps() {
  const client = await pool.connect();
  const res = await client.query('SELECT * FROM heroes');
  client.release();

  return {
    props: {
      data: res.rows
    }
  };
}

function Home({ data }) {

  return(
    <div className="static h-screen flex justify-center">
      <div>
        <img src="../dota2background.jpg" alt="background" className="blur-sm w-screen" />
        <div className="absolute">
          
        </div>
      </div>
    </div>
    
  )
}

export default Home