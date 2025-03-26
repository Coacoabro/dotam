import { useState } from 'react';
import innates from '../../../../../json/hero_innate.json';

export default function Innate({ id }) {
    const innate = innates[id];
    const description = innate.Desc.split('<br><br>');

    const [toolTip, setToolTip] = useState(false);

    const showTooltip = () => {
        setToolTip(true);
    };

    const hideTooltip = () => {
        setToolTip(false);
    };

    const innatePress = () => {
        if (toolTip) {
            hideTooltip();
        } else {
            showTooltip();
        }
    };

    return (
        <div className="relative">
            <button onClick={innatePress} className="relative sm:p-1 h-8 w-8 hover:scale-110 sm:h-16 sm:w-16">
                <img
                    src="https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/innate_icon.png"
                    alt="Innate"
                    className=""
                    onMouseEnter={showTooltip}
                    onMouseLeave={hideTooltip}
                />
            </button>
            {toolTip && (
                <div
                    className="fixed sm:absolute sm:w-[400px] sm:top-[110%] sm:left-1/2 sm:-translate-x-1/2 sm:transform top-100 rounded-lg left-8 flex items-center justify-center bg-black bg-opacity-75 z-30"
                    style={{
                        visibility: toolTip ? 'visible' : 'hidden',
                    }}
                >
                    <div className="text-white border-slate-900 shadow whitespace-pre-line z-40 w-[300px] sm:w-[400px]">
                        <div className="text-lg sm:text-2xl flex font-bold rounded-t-lg py-2 px-3 sm:py-2 sm:px-5 bg-slate-800 items-center gap-2 border-slate-600 shadow border-t border-l border-r">
                            <img src="https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/innate_icon.png" className='w-8 h-8 sm:w-12 sm:h-12' /> 
                            {innate.Name}
                        </div>
                        {description.length > 1 ? description.map((paragraph, index) => (
                            <p key={index} className={`text-sm sm:text-lg px-3 py-2 sm:px-6 sm:py-5 bg-slate-950 text-cyan-300 ${description.length == (index+1) ? 'rounded-b-lg border-b' : null} border-l border-r border-slate-600`}>{paragraph}</p>
                        )) : <p className="text-sm sm:text-lg px-3 py-2 sm:px-6 sm:py-5 bg-slate-950 text-cyan-300 rounded-b-lg border-b border-l border-r border-slate-600">{description}</p>}
                    </div>
                </div>
            )}
        </div>
    );
}
