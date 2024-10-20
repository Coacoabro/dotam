import { useState, useRef } from 'react';
import ItemIds from '../../../dotaconstants/build/item_ids.json';
import ItemInfo from '../../../dotaconstants/build/items.json';
import Components from '../../../json/components.json';

export default function ItemCard({ id }) {
    const item = ItemInfo[ItemIds[id]];
    const videoRef = useRef(null);
    const [toolTip, setToolTip] = useState(false);

    const showTooltip = () => {
        setToolTip(true);
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.addEventListener('canplay', function() {
                this.play();
            });
        }
    };

    const hideTooltip = () => {
        setToolTip(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    const toggleTooltip = () => {
        if (toolTip) {
            hideTooltip();
        } else {
            showTooltip();
        }
    };

    if (item) {
        const itemImg = 'https://cdn.cloudflare.steamstatic.com' + item.img;
        const components = Components[id]
            ? Components[id].map((component) => 'https://cdn.cloudflare.steamstatic.com' + ItemInfo[ItemIds[component]].img)
            : [];
        const itemDesc = item.abilities
            ? item.abilities.map((ability) => ability.description)
            : ["Basic Attribute Bonus"];

        return (
            <div className="relative">
                <button onClick={toggleTooltip} className="relative">
                    <img src={itemImg} className='w-12 sm:w-16' onMouseEnter={showTooltip} onMouseLeave={hideTooltip} />
                </button>
                {toolTip && (
                    <div className='fixed sm:absolute sm:w-[400px] sm:top-[90%] sm:left-1/2 sm:-translate-x-1/2 sm:transform top-100 left-8 flex items-center justify-center z-50' style={{ visibility: toolTip ? 'visible' : 'hidden' }}>
                        <div className='relative -mx-16 mt-3 w-[320px] sm:w-[400px]'>
                            <div className='flex bg-slate-800 items-center gap-2.5 py-2 px-5 rounded-t-lg border-slate-600 border-t border-l border-r'>
                                <img src={itemImg} className='w-12 sm:w-16 h-full' />
                                <div>
                                    <h1 className='text-xl sm:text-2xl font-bold'>{item.dname}</h1>
                                    <h2 className='flex gap-1 items-center text-sm sm:text-base text-gold-400'>
                                        <img src='/gold.png' className='w-4 sm:w-5 h-full' />
                                        {item.cost}
                                    </h2>
                                </div>
                            </div>
                            <div className='bg-slate-950 py-3 px-5 text-left space-y-3 border-r border-l border-b border-slate-700 rounded-b-lg'>
                                <div className='space-y-3'>
                                    {item.abilities ? item.abilities[0] ? item.abilities.map((ability, index) => (
                                        <div key={index} className='p-2 space-y-2'>
                                            <div className="flex gap-2 items-center justify-between">
                                                <h1 className='text-lg sm:text-xl font-bold'>{ability.title}</h1>
                                                <h2 className='text-sm sm:text-base opacity-50 uppercase'>{ability.type}</h2>
                                            </div>
                                            <div className='py-2 text-base sm:text-lg text-cyan-300'>{ability.description}</div>
                                        </div>
                                    )) : null :null}
                                    {item.abilities && item.attrib ? item.abilities[0] && item.attrib[0] ? item.attrib[0].display ? <div className='sm:w-[350px] h-[1px] bg-slate-700' /> : null : null : null}
                                    {item.attrib ? item.attrib.map((attr) => (
                                        <div className='text-lg text-slate-200/75'>
                                            {attr.display ? attr.display.replace("{value}", attr.value) : null}
                                        </div>
                                    )) : null}
                                </div>
                                {components.length > 0 ? 
                                    <div className='space-y-3'>
                                        <div className='sm:w-[350px] h-[1px] bg-slate-700' />
                                        <div className='px-3 space-y-1'>
                                            <h1>Builds Into</h1>
                                            <div className='flex space-x-4'>
                                                {components.map((component, index) => (
                                                    <img key={index} src={component} className='w-10 sm:w-12' />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                : null}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return null;
}
