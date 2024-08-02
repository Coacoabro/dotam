import { useState } from 'react';
import Abilities from '../../../../dotaconstants/build/abilities.json';

export default function TalentTree({ talents }) {
    const Talents = [];
    talents.forEach((talent) => {
        Talents.push(Abilities[talent.name].dname.replace(/\{[^}]*\}/g, '?'));
    });
    const leftTalents = [Talents[6], Talents[4], Talents[2], Talents[0]];
    const rightTalents = [Talents[7], Talents[5], Talents[3], Talents[1]];
    const levels = [25, 20, 15, 10];

    const [toolTip, setToolTip] = useState(false);

    const showTooltip = () => {
        setToolTip(true);
    };

    const hideTooltip = () => {
        setToolTip(false);
    };

    const talentPress = () => {
        if (toolTip) {
            hideTooltip();
        } else {
            showTooltip();
        }
    };

    return (
        <div className="relative">
            <button onClick={talentPress} className="relative sm:p-1 h-8 w-8 hover:scale-110 sm:h-16 sm:w-16">
                <img
                    src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/talents.svg"
                    alt="Talent Tree"
                    className=""
                    onMouseEnter={showTooltip}
                    onMouseLeave={hideTooltip}
                />
            </button>
            {toolTip && (
                <div
                    className="fixed sm:absolute sm:w-[500px] sm:top-[110%] sm:left-1/2 sm:-translate-x-1/2 sm:transform top-100 left-8 flex items-center justify-center bg-black bg-opacity-75 z-30"
                    style={{
                        visibility: toolTip ? 'visible' : 'hidden',
                    }}
                >
                    <div className="text-slate-200 border-slate-900 shadow whitespace-pre-line z-40 w-[300px] sm:w-[500px]">
                        <div className="text-lg sm:text-3xl flex font-bold rounded-t-lg py-2 px-3 sm:py-2 sm:px-5 bg-slate-800 items-center gap-2 justify-center border-slate-600 shadow border-t border-l border-r">
                            <img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/talents.svg" className='h-8 w-8 sm:h-12 sm:w-12' />
                            Talents
                        </div>
                        <div className="flex flex-col items-center space-y-3 px-6 py-5 bg-slate-950 text-cyan-300 text-left rounded-b-lg border-b border-l border-r border-slate-600">
                            {levels.map((level, index) => (
                                <div key={index} className='space-y-3'>
                                    <div className="text-xs sm:text-base flex items-center space-x-2 sm:space-x-8 px-4">
                                        <div className="w-28 sm:w-36 text-center text-cyan-300">
                                            {leftTalents[index]}
                                        </div>
                                        <div className="relative flex items-center justify-center w-8 h-8 sm:w-14 sm:h-14 bg-slate-700 rounded-full shadow-md">
                                            <span className="text-white text-sm sm:text-xl text-center font-bold">
                                                {level}
                                            </span>
                                        </div>
                                        <div className="w-28 sm:w-36 text-center text-cyan-300">
                                            {rightTalents[index]}
                                        </div>
                                    </div>
                                    {index < 3 ? (
                                        <div className="w-[280px] sm:w-[450px] h-[1px] sm:h-[2px] bg-slate-700 flex justify-center mx-auto" />
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
