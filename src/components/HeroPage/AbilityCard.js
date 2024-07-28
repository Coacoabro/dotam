import {useState, useRef} from 'react'

import Abilities from '../../../dotaconstants/build/abilities.json'
import AghsDesc from '../../../dotaconstants/build/aghs_desc'

export default function AbilityCard({ ability, hero, type, path }) {

  const heroName = hero.replace("npc_dota_hero_", "")
  const abilityInfo = Abilities[ability];

  const scepterImg = "https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/stats/aghs_scepter.png"
  const shardImg = "https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/stats/aghs_shard.png"

  let abilityDesc = ""

  let abilityVideo = ""
  if(type == "Shard") {
    abilityVideo = 'https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/abilities/' + heroName + '/' + heroName + '_aghanims_shard.webm'
    abilityDesc = AghsDesc.find(obj => obj.hero_name == hero)?.shard_desc
  }
  else if (type == "Scepter") {
    abilityVideo = 'https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/abilities/' + heroName + '/' + heroName + '_aghanims_scepter.webm'
    abilityDesc = AghsDesc.find(obj => obj.hero_name == hero)?.scepter_desc
  }
  else{
    abilityVideo = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/videos/dota_react/abilities/' + heroName + '/' + ability + '.webm'
    abilityDesc = abilityInfo.desc
  }
  
  const videoRef = useRef(null);

  const showTooltip = (event) => {
    const tooltip = event.target.nextElementSibling;
    tooltip.style.visibility = 'visible';
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.addEventListener('canplay', function() {
        this.play();
      });
    }
  };

  const hideTooltip = (event) => {
    const tooltip = event.target.nextElementSibling;
    tooltip.style.visibility = 'hidden';
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  };

  return (
    <button onClick={() => window.open(abilityVideo, '_blank')} className={`relative hover:scale-110 ${path ? 'h-10 w-10' : 'w-8 h-8 sm:h-16 sm:w-16'}`}>
      {type == "Shard" ? (
        <img src={shardImg} className="w-8 h-8 sm:h-14 sm:w-14 absolute pointer-events-none" />
      ) : type == "Scepter" ? (
        <img src={scepterImg} className="w-8 h-8 sm:h-14 sm:w-14 absolute pointer-events-none" />
      ) : null}
      <img
        src={'https://cdn.cloudflare.steamstatic.com' + abilityInfo.img}
        className={`${path ? 'h-10 w-10' : 'w-8 h-8 sm:w-14 sm:h-14'} rounded-md z-0`}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      />
      <div
          className="absolute text-white border-slate-900 shadow whitespace-pre-line z-30"
          style={{
              visibility: "hidden",
              top: '110%', // Adjust the position of the tooltip
              left: '50%', // Position the tooltip centrally
              transform: 'translateX(-50%)',
              width: '400px', // Adjust width as needed
          }}
      >
          <div className="text-2xl flex font-bold rounded-t-lg py-2 px-5 bg-slate-800 items-center gap-2 border-slate-600 shadow border-t border-l border-r">
            <img src={'https://cdn.cloudflare.steamstatic.com' + abilityInfo.img} className="w-12 h-12 rounded-md" />
            {abilityInfo.dname}
          </div>
          <div className="px-6 py-5 bg-slate-950 text-indigo-300 text-left border-slate-600 shadow border-l border-r">{abilityDesc}</div>
          <video ref={videoRef} className="rounded-b-lg" src={abilityVideo} type='video/webm' muted loop disablePictureInPicture />
      </div>
    </button>
  );
}