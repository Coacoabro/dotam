import Link from 'next/link';

function Home() {
  return (
    <div className="bg gray 300">
      <h1>Home Page</h1>
      <Link href="/heroes">Hero List</Link>
      <br />
      <Link href="/tier-list">Tier List</Link>
    </div>
  );
}

export default Home;
