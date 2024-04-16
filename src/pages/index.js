import { Pool } from 'pg';
import SearchBar from '../components/SearchBar';

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
        {/*<img src="../dota2background.jpg" alt="background" className="blur-sm w-screen" />*/}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 space-y-6">
          <SearchBar />
        </div>
        {/*<div className='absolute bottom-1 left-1/4 -translate-x-1/2 -translate-y-1/2 space-y-2 bg-gray-700 px-4 py-2 rounded-md'>
            <div className="text-center text-white">Powered By:</div>
            <div className="flex justify-between space-x-10 text-white">
              <div className="text-center text-xs">
                <a href="https://www.stratz.com/api" target="_blank" ><img src="../StratzLogo.png" alt="logo" className="w-12" /></a>
                Stratz
              </div>
              <div className="text-center flex-bottom justify-center text-xs">
                <a href="https://www.opendota.com" target="_blank" ><img src="../OpenDotaLogo.png" alt="logo" className="w-12" /></a>
                OpenDota
              </div>
            </div>
  </div>*/}
      </div>
    </div>
    
  )
}

export default Home