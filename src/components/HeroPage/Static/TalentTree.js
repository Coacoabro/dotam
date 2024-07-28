import Abilities from '../../../../dotaconstants/build/abilities.json'

export default function TalentTree({ talents }) {

    const Talents = []
    talents.forEach((talent) => {
        Talents.push(Abilities[talent.name].dname.replace(/\{[^}]*\}/g, '?'))
    })
    const leftTalents = [Talents[6], Talents[4], Talents[2], Talents[0]]
    const rightTalents = [Talents[7], Talents[5], Talents[3], Talents[1]]
    const levels = [25, 20, 15, 10]

    const showTooltip = (event) => {
        const tooltip = event.target.nextElementSibling;
        tooltip.style.visibility = 'visible';
    };
    
    const hideTooltip = (event) => {
        const tooltip = event.target.nextElementSibling;
        tooltip.style.visibility = 'hidden';
    };

    return(
        <div className="relative">
            <img
                src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/talents.svg"
                alt="Talent Tree"
                className="relative sm:p-1 h-8 w-8 hover:scale-110 sm:h-16 sm:w-16"
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
            />

            <div
                className="absolute text-white border-gray-900 shadow whitespace-pre-line"
                style={{
                visibility: "hidden",
                top: '110%', // Adjust the position of the tooltip
                left: '50%', // Position the tooltip centrally
                transform: 'translateX(-50%)',
                width: '500px', // Adjust width as needed
                height: 'auto', // Let the height expand according to content
                }}
            >
                <div className="text-3xl flex font-bold rounded-t-lg py-2 px-5 bg-slate-700 border border-slate-600 justify-center items-center gap-2">
                    <img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/talents.svg" className='h-12 w-12' />
                    Talents
                </div>
                <div className="flex flex-col items-center space-y-3 px-6 py-5 bg-slate-950 text-indigo-300 text-left rounded-b-lg border-b border-l border-r border-slate-600">
                    {levels.map((level, index) => (
                        <div className='space-y-3'>
                            <div className="flex items-center space-x-8 px-4">
                                <div className="w-36 text-center text-indigo-300">
                                    {leftTalents[index]}
                                </div>
                                <div className="relative flex items-center justify-center w-14 h-14 bg-slate-700 rounded-full shadow-md">
                                    <span className="text-white text-xl text-center font-bold">
                                        {level}
                                    </span>
                                </div>
                                <div className="w-36 text-center text-indigo-300">
                                    {rightTalents[index]}
                                </div>
                            </div>
                            {index < 3 ? (
                                <div className="w-[450px] h-[2px] bg-slate-700 flex justify-center mx-auto" />
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}