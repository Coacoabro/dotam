export default function TalentRow({ level, right, left }) {

    const totalMatches = right.Matches + left.Matches
    const rightPR = ((right.Matches / totalMatches)*600).toFixed(0)
    const rightWR = ((right.Wins / right.Matches)*100).toFixed(2)
    const leftPR = ((left.Matches / totalMatches)*600).toFixed(0)
    const leftWR = ((left.Wins / left.Matches)*100).toFixed(2)

    return(
        <div className="relative flex justify-center py-3">

            <div className="w-[50%] space-y-2 text-right text-sm">
                <div className={`${leftWR > rightWR ? 'font-bold' : 'opacity-75'} px-6`}>{leftWR}% <span className="text-cyan-300">WR</span></div>
                <div className="text-lg pr-8 py-1">
                    <div 
                        className={`absolute right-1/2 -mt-1.5 h-10 bg-slate-800 rounded-l-md ${leftWR > rightWR ? 'border border-cyan-300/50' : null}`} 
                        style={{ width: `${leftPR}px`}}
                    />
                    <div className="relative">{left.Talent}</div>
                </div>
                <div className="px-6">{left.Matches.toLocaleString()} <span className="text-cyan-300">Matches</span></div>
            </div>
            

            <div className="z-30 absolute left-1/2 -translate-x-1/2 py-4">
                <div className="rounded-full bg-slate-800 h-full py-3 px-3.5 text-2xl border border-cyan-300/50">
                    {level}
                </div>
            </div>


            <div className="w-[50%] space-y-2 text-sm">
                <div className={`${leftWR < rightWR ? 'font-bold' : 'opacity-75'} px-6`}>{rightWR}% <span className="text-cyan-300">WR</span></div>
                <div className="text-lg pl-8 py-1">
                    <div 
                        className={`absolute left-1/2 -mt-1.5 h-10 rounded-r-md bg-slate-800 ${leftWR < rightWR ? 'border border-cyan-300/50' : null}`} 
                        style={{ width: `${rightPR}px`}}
                    />
                    <div className="relative">{right.Talent}</div>
                </div>
                <div className="px-6">{right.Matches.toLocaleString()} <span className="text-cyan-300">Matches</span></div>
            </div>

        </div>
    )
}