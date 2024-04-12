import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import heroConstants from '../../../dotaconstants/build/heroes.json';

const TierCard = ({ tier_str, hero, WR, PR, matches, counters, index }) => {
  const [threeCounters, setThreeCounters] = useState([]);

  useEffect(() => {
    if (counters) {
      const heroCounters = counters.herovs;
      const reverseCounters = heroCounters.slice(-5).reverse();
      const finalCounters = reverseCounters.map(hero => hero.Hero);
      setThreeCounters(finalCounters);
    }
  }, [counters]);

  if (!hero) return null;

  const heroName = hero.localized_name;
  const img = 'https://cdn.cloudflare.steamstatic.com' + hero.img;

  return (
    <tr className={`text-white text-xl ${index % 2 === 1 ? 'bg-gray-800' : ''}`}>
      <td className="px-6 py-3 text-2xl">{tier_str}</td>
      <td className="px-30 py-3">
        <Link href={`/hero/${hero.hero_id}`}>
          <div className="flex items-center space-x-3">
            <div className="w-32">
              <img src={img} alt={heroName} />
            </div>
            <div className="text-xl">{heroName}</div>
          </div>
        </Link>
      </td>
      <td className="px-8 py-3">{(WR * 100).toFixed(2)}%</td>
      <td className="px-8 py-3">{(PR * 100).toFixed(2)}%</td>
      <td className="px-6 py-3">{matches.toLocaleString()}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center space-x-2">
          {threeCounters.map(hero => (
            <Link href={`/hero/${hero}`} key={hero}>
              <img
                className="w-8"
                src={hero ? `https://cdn.cloudflare.steamstatic.com/${heroConstants[hero].icon}` : null}
                alt={heroConstants[hero].localized_name}
              />
            </Link>
          ))}
        </div>
      </td>
    </tr>
  );
};

export default TierCard;
