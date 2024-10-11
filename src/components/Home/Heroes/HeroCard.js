import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link'

import dota2heroes from '../../../../json/dota2heroes.json'

export default function HeroCard({ hero, search }) {

  const [isLoaded, setIsLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [searched, setSearched] = useState(false)
  const searchName = hero.localized_name.toLowerCase()
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

  useEffect(() => {
    if(search) {
      if(searchName.includes(search.toLowerCase())){
        setSearched(100)
      }
      else{setSearched(25)}
    } else{setSearched(100)}
  }, [search])

  return (

    <Link href={`/hero/${heroURL}/builds`}>
      <div
        className={`relative rounded-md transition-transform duration-300 hover:scale-150 hover:z-10 opacity-${searched}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute inset-0 flex items-end overflow-hidden">
          <div className={`${hovered ? 'translate-y-0' : 'translate-y-full'} hidden transition-transform duration-300 text-2xs ease-in-out text-white bottom-0 left-0 px-2 py-1 z-20`}>
            {hero.localized_name}
          </div>
        </div>
        <img src={heroImage} className={`${hovered ? 'rounded-lg' : ''} transition-transform duration-300 p-1 w-[64px] h-[85px]`} />
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
