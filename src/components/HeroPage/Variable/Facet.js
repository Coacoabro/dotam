export default function Facet({ facet }) {
    return(
        <div className="w-[350px] z-50">
            <div className="text-2xl flex font-bold rounded-t-lg py-2 px-5 bg-slate-700 items-center gap-2 border-slate-600 shadow border-t border-l border-r">
                <img src={'https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/facets/' + facet.Icon + '.png'} className="w-12 h-12 rounded-md" />
                {facet.Title.replace(/\{[^}]*\}/g, '?')}
            </div>
            <div className="px-6 py-5 bg-slate-950 text-indigo-300 text-left border-slate-600 shadow border rounded-b-lg">
                {facet.Desc}
            </div>
        </div>
    )
}