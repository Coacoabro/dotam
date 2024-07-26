import {useState, useRef} from 'react'

import ItemIds from '../../../dotaconstants/build/item_ids.json'
import ItemInfo from '../../../dotaconstants/build/items.json'
import Components from '../../../json/components.json'

export default function ItemCard({id}) {

    const item = ItemInfo[ItemIds[id]]
    if(item) {
        const itemImg = 'https://cdn.cloudflare.steamstatic.com' + item.img
        const components = []
    
        if (Components[id]) {
            Components[id].map((component) => {
                components.push('https://cdn.cloudflare.steamstatic.com' + ItemInfo[ItemIds[component]].img)
            })
        }
    
        const itemDesc = []
        
        if (item.abilities) {
            item.abilities.map((ability) => {
                itemDesc.push(ability.description)
            })
        }
        else {
            itemDesc.push("Basic Attribute Bonus")
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
    
    
        return(
            <div>
                <img src={itemImg} className='w-16' onMouseEnter={showTooltip} onMouseLeave={hideTooltip} />
                <div className='absolute z-50 -mx-16 mt-3 w-[400px]' style={{visibility: 'hidden'}}>
                    <div className='flex bg-slate-800 items-center gap-2.5 py-2 px-5 rounded-t-lg border-slate-600 border-t border-l border-r'>
                        <img src={itemImg} className='w-16 h-full' />
                        <div>
                            <h1 className='text-2xl font-bold'>{item.dname}</h1>
                            <h2 className='flex gap-1 items-center'>
                                <img src='/gold.png' className='w-5 h-full' />
                                {item.cost}
                            </h2>
                        </div>
                    </div>
                    <div className='bg-slate-950 py-3 px-5 text-left space-y-3 border-r border-l border-b border-slate-700 rounded-b-lg'>
                        {item.abilities ? item.abilities[0] ? 
                            <div className='space-y-3'>
                                {item.abilities.map((ability) => (
                                    <div className='p-2 space-y-2'>
                                        <div className="flex gap-2 items-center justify-between">
                                            <h1 className='text-xl font-bold'>{ability.title}</h1>
                                            <h2 className='opacity-50 uppercase'>{ability.type}</h2>
                                        </div>
                                        <div className='text-lg'>{ability.description}</div>
                                    </div>
                                ))}
                            </div>
                        :
                            <div className='text-lg'>Basic Attribute Bonuses</div>
                        :
                            <div className='text-lg'>Basic Attribute Bonuses</div>
                        }    
                        {components.length > 0 ? 
                            <div className='space-y-3'>
                                <div className='w-[350px] h-[1px] bg-slate-700' />
                                <div className='px-3 space-y-1'>
                                    <h1>Builds Into</h1>
                                    <div className='flex space-x-4'>
                                        {components.map((item) => (
                                            <img src={item} className='w-12'/>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        : null}
                    </div>
                </div>
            </div>
        )
    }
    
}