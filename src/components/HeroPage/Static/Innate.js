import innates from '../../../../json/hero_innate.json'

export default function Innate({ id }) {

    const innate = innates[id]

    const description = innate.Desc.split('<br><br>')

    const showTooltip = (event) => {
        const tooltip = event.target.nextElementSibling;
        tooltip.style.visibility = 'visible';
    };
    
    const hideTooltip = (event) => {
        const tooltip = event.target.nextElementSibling;
        tooltip.style.visibility = 'hidden';
    };


    return(
        <div className="relative p-1 h-10 w-10 hover:scale-110 md:h-16 md:w-16">
            <img
                src="https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/innate_icon.png"
                alt="Innate"
                className=""
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
            />
            <div
                className="absolute text-white border-slate-900 shadow whitespace-pre-line "
                style={{
                visibility: "hidden",
                top: '110%', // Adjust the position of the tooltip
                left: '50%', // Position the tooltip centrally
                transform: 'translateX(-50%)',
                width: '400px', // Adjust width as needed
                height: 'auto', // Let the height expand according to content
                }}
            >
                <div className="text-2xl flex font-bold rounded-t-lg py-2 px-5 bg-slate-700 items-center gap-2 justify-start">
                    <img src="https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/innate_icon.png" className='w-12 h-12' /> 
                    {innate.Name}
                </div>
                {description.length > 1 ? description.map((paragraph, index) => (
                    <p className={`px-6 py-5 bg-slate-950 text-indigo-300 ${description.length == (index+1) ? 'rounded-b-lg border-b' : null} border-l border-r border-slate-600`}>{paragraph}</p>
                )) : <p className="px-6 py-5 bg-slate-950 text-indigo-300 rounded-b-lg border-b border-l border-r border-slate-600">{description}</p>}
            </div>
        </div>
    )
}