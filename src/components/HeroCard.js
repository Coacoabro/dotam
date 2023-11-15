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
        className="relative rounded-md"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="absolute inset-0 flex justify-center items-end overflow-hidden">
          <div
            className={`${
              hovered ? 'translate-y-0' : 'translate-y-full'
            } transition-transform duration-300 ease-in-out text-white bg-opacity-50 px-2 py-1 z-20`}
          >
            {hero.localized_name}
          </div>
        </div>
        <img
          src={heroImage}
          alt={hero.name}
          className="w-28 h-32 object-cover transition-transform duration-300 p-1
          "
        />
        {hovered && (
          <video
            autoPlay
            loop
            muted
            className="absolute inset-0 w-full h-full object-cover rounded-md transition-transform duration-300 shadow-md hover:scale-125 z-10"
          >
            <source src={heroVideo} type="video/webm" />
          </video>
        )}
      </div>
    </Link>
  );
}

export default HeroCard;
