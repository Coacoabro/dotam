import React, { useState } from 'react';
import Link from 'next/link';

function HeroCard({ hero }) {
  const [hovered, setHovered] = useState(false);
  const heroURL = hero.name.split('npc_dota_hero_')[1];

  const heroImage = '/hero_thumbnail/' + heroURL + '.jpg';
  const heroVideo = '/hero_animation/' + hero.name + '.webm';

  return (
    <Link href={`/heroes/${heroURL}`}>
      <div
        className="relative rounded-md transition-transform duration-300 hover:scale-150 hover:z-10"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="absolute inset-0 flex items-end overflow-hidden">
          <div
            className={`${
              hovered ? 'translate-y-0' : 'translate-y-full'
            } transition-transform duration-300 ease-in-out text-white text-sm bottom-0 left-0 px-2 py-1 z-20`}
          >
            {hero.localized_name}
          </div>
        </div>
        <img
          src={heroImage}
          alt={hero.name}
          className="w-28 h-32 object-cover transition-transform duration-300 p-1"
        />
        {hovered && (
          <video
            autoPlay
            loop
            muted
            className="absolute inset-0 w-full h-full object-cover rounded-md shadow-md"
          >
            <source src={heroVideo} type="video/webm" />
          </video>
        )}
      </div>
    </Link>
  );
}

export default HeroCard;
