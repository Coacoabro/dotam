import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import heroConstants from '../../../dotaconstants/build/heroes.json';

const TierCard = ({ tier_str, role, hero, WR, PR, matches, counters, index }) => {

  const Role = [
    {role: "", name: "All", icon: "../icons8-product-90.png"},
    {role: "POSITION_1", name: "Safe Lane", icon: "../Safe-Lane.png"},
    {role: "POSITION_2", name: "Mid Lane", icon: "../Mid-Lane.png"},
    {role: "POSITION_3", name: "Off Lane", icon: "../Off-Lane.png"},
    {role: "POSITION_4", name: "Soft Support", icon: "../Soft-Support.png"},
    {role: "POSITION_5", name: "Hard Support", icon: "../Hard-Support.png"},
  ]

  const [threeCounters, setThreeCounters] = useState([]);
  const [roleImage, setRoleImage] = useState('');
  const [roleName, setRoleName] = useState('');

  useEffect(() => {
    if (role) {
      const roleImage = Role.find(r => r.role === role).icon;
      const roleName = Role.find(r => r.role === role).name;
      setRoleImage(roleImage);
      setRoleName(roleName);
    }
    if (counters) {
      const heroCounters = counters.herovs;
      const reverseCounters = heroCounters.slice(-5).reverse();
      const finalCounters = reverseCounters.map(hero => hero.Hero);
      setThreeCounters(finalCounters);
    }
  }, [counters, role]);

  if (!hero) return null;

  const heroName = hero.localized_name;
  const img = 'https://cdn.cloudflare.steamstatic.com' + hero.img;

  return (
    <tr className={`text-white text-xl ${index % 2 === 1 ? 'bg-gray-800' : ''}`}>
      <td className="px-6 py-3 text-2xl">{tier_str}</td>
      <td className="px-1 py-3">
        <Link href={`/hero/${hero.hero_id}`}>
          <div className="flex items-center text-left space-x-2">
            <div className="w-28">
              <img src={img} />
            </div>
            <div className="text-xl">{heroName}</div>
          </div>
        </Link>
      </td>
      <td className="px-4 py-3 justify-items-center"><img className="w-8" src={roleImage} title={roleName} /></td>
      <td className="px-4 py-3">{(WR * 100).toFixed(2)}%</td>
      <td className="px-4 py-3">{(PR * 100).toFixed(2)}%</td>
      <td className="px-4 py-3">{matches.toLocaleString()}</td>
      <td className="px-2 py-3">
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
