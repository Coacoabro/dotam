import React, { useState, useRef } from 'react';
import Link from 'next/link'

import dota2heroes from '../../../../json/dota2heroes.json'

export default function HeroCard({ hero }) {

  const [isLoaded, setIsLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const heroURL = dota2heroes.find(r => r.id === hero.id)?.url

  const heroImage = 'https://dhpoqm1ofsbx7.cloudfront.net/hero_thumbnail/' + hero.name + '.jpg';
  const heroVideo = 'https://dhpoqm1ofsbx7.cloudfront.net/hero_animation/' + hero.name + '.webm';

  const handleLoadedData = () => {
    setIsLoaded(true)
  }

  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    setHovered(true)
    if(videoRef.current){
      videoRef.current.play().catch(error => {
        if (error.name !== 'AbortError') {
          console.error('Error playing video:', error);
        }
      });
    }
  };

  const handleMouseLeave = () => {
    setHovered(false)
    if(videoRef.current){
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (

    <Link href={`/hero/${heroURL}`}>
      <div
        className="relative rounded-md transition-transform duration-300 hover:scale-150 hover:z-10"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute inset-0 flex items-end overflow-hidden">
          <div className={`${hovered ? 'translate-y-0' : 'translate-y-full'} transition-transform duration-300 text-xs ease-in-out text-white bottom-0 left-0 px-2 py-1 z-20`}>
            {hero.localized_name}
          </div>
        </div>
        <img src={heroImage} className={`${hovered ? 'rounded-lg' : ''} object-cover transition-transform duration-300 p-1 w-[81px] h-[108px]`} />
        {/* 
        {hovered && 
          <video className={`absolute inset-0 w-full h-full object-cover rounded-md shadow-md`} onLoadedData={handleLoadedData} autoPlay loop disablePictureInPicture>
            <source src={heroVideo} type="video/webm" />
          </video>
        }
        <video
          ref={videoRef}
          className='object-cover rounded-lg shadow-md w-[81px] h-[108px] p-1'
          poster={heroImage}
          loop
          muted
        >
          <source src={heroVideo} type="video/webm" />
        </video>
         */}
      </div>
    </Link>
  );
}
