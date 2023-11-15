import React, { useState } from 'react';
import Link from 'next/link';

function HeroCard({ hero }) {
  const [hovered, setHovered] = useState(false);
  const heroURL = hero.name.split('npc_dota_hero_')[1];

  const heroImage = '/hero_thumbnail/' + heroURL + '.jpg'
  const heroVideo = '/hero_animation/' + hero.name + '.webm'

  return (
    <Link href={`/heroes/${heroURL}`}>
        <div
        className=
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        >
        {hovered ? (
            <video autoPlay loop muted>
            <source src={heroVideo} type="video/webm" />
            </video>
        ) : (
            <img src={heroImage} alt={hero.name} />
        )}
        </div>
    </Link>
    
    );
    
}

export default HeroCard;
