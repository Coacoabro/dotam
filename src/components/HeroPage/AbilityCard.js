import { useState, useRef } from 'react'

import Abilities from '../../../dotaconstants/build/abilities.json'
import AghsDesc from '../../../dotaconstants/build/aghs_desc'

export default function AbilityCard({ ability, hero, type, path }) {

  const videoRef = useRef(null);

  const [toolTip, setToolTip] = useState(false)

  const showTooltip = () => {
    setToolTip(true)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.addEventListener('canplay', function () {
        this.play();
      });
    }
  };

  const hideTooltip = () => {
    setToolTip(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  };

  const abilityPress = () => {
    if (toolTip) {
      hideTooltip()
    } else {
      showTooltip()
    }
  }

  if(ability) {

    const heroName = hero.replace("npc_dota_hero_", "")
    const abilityInfo = Abilities[ability];
  
    const scepterImg = "https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/stats/aghs_scepter.png"
    const shardImg = "https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/stats/aghs_shard.png"
  
    let abilityDesc = ""
  
    let abilityVideo = ""
  
    if (type == "Shard") {
      abilityVideo = 'https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/abilities/' + heroName + '/' + heroName + '_aghanims_shard.webm'
      abilityDesc = AghsDesc.find(obj => obj.hero_name == hero)?.shard_desc
    }
    else if (type == "Scepter") {
      abilityVideo = 'https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/abilities/' + heroName + '/' + heroName + '_aghanims_scepter.webm'
      abilityDesc = AghsDesc.find(obj => obj.hero_name == hero)?.scepter_desc
    }
    else {
      abilityVideo = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/videos/dota_react/abilities/' + heroName + '/' + ability + '.webm'
      abilityDesc = abilityInfo.desc
    }
  
    return (
      <div className="relative">
        <button onClick={abilityPress} className={`relative hover:scale-110 ${path ? 'w-6 h-6 sm:h-10 sm:w-10' : 'w-8 h-8 sm:h-16 sm:w-16'}`}>
          {type == "Shard" ? (
            <img src={shardImg} className="w-8 h-8 sm:h-14 sm:w-14 absolute pointer-events-none" />
          ) : type == "Scepter" ? (
            <img src={scepterImg} className="w-8 h-8 sm:h-14 sm:w-14 absolute pointer-events-none" />
          ) : null}
          <img
            src={'https://cdn.cloudflare.steamstatic.com' + abilityInfo.img}
            className={`${path ? 'w-6 h-6 sm:h-10 sm:w-10' : 'w-8 h-8 sm:w-14 sm:h-14'} rounded-md z-0`}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
          />
        </button>
        {toolTip && (
          <div
            className="fixed sm:absolute sm:w-[400px] sm:top-[110%] sm:left-1/2 sm:-translate-x-1/2 sm:transform rounded-lg top-100 left-8 flex items-center justify-center bg-black bg-opacity-75 z-30"
            style={{
              visibility: toolTip ? 'visible' : 'hidden',
            }}
          >
            <div className="text-slate-200 border-slate-900 shadow whitespace-pre-line z-40 w-[300px] sm:w-[400px]">
              <div className="text-lg sm:text-2xl flex font-bold rounded-t-lg px-3 py-2 sm:px-6 sm:py-3 bg-slate-800 items-center gap-2 border-slate-600 shadow border-t border-l border-r">
                <img src={'https://cdn.cloudflare.steamstatic.com' + abilityInfo.img} className="w-8 h-8 sm:w-12 sm:h-12 rounded-md" />
                {abilityInfo.dname}
              </div>
              <div className="text-sm sm:text-lg px-3 py-2 sm:px-6 sm:py-5 bg-slate-950 text-cyan-300 text-left border-slate-600 shadow border-l border-r">{abilityDesc}</div>
              <video ref={videoRef} className="rounded-b-lg" src={abilityVideo} type='video/webm' autoPlay muted loop disablePictureInPicture />
            </div>
          </div>
        )}
      </div>
    );
  }

  
}
