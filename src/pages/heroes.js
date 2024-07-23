import Heroes from '../components/Home/Heroes';
import SearchBar from '../components/SearchBar'

export default function HeroesPage() {
  return (
    <div className='py-10 space-y-10 z-0'>
        <SearchBar />
        <Heroes />
    </div>
  );
}