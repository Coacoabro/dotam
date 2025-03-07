import { useEffect, useState } from "react"

export default function TalentRow({ level, right, left }) {

    const [screenHalfWidth, setScreenHalfWidth] = useState(window.innerWidth < 1200 ? window.innerWidth/2 : 600)

    useEffect(() => {
        const updateWidth = () => {
            setScreenHalfWidth(window.innerWidth < 1200 ? window.innerWidth/2 : 600)
        }
        updateWidth()
        window.addEventListener('resize', updateWidth)
        return () => window.removeEventListener('resize', updateWidth)
    }, [])

    if(right && left) {

        const totalMatches = right.Matches + left.Matches
        const rightPR = ((right.Matches / totalMatches)*screenHalfWidth).toFixed(0)
        const rightWR = ((right.Wins / right.Matches)*100).toFixed(2)
        const leftPR = ((left.Matches / totalMatches)*screenHalfWidth).toFixed(0)
        const leftWR = ((left.Wins / left.Matches)*100).toFixed(2)
        const lWRColor = leftWR >= 51.5 ? 'text-[#ABDEED]' 
        : leftWR >= 48.5 ? 'text-slate-200'
        : 'text-[#F46E58]'
        const rWRColor = rightWR >= 51.5 ? 'text-[#ABDEED]' 
        : rightWR >= 48.5 ? 'text-slate-200'
        : 'text-[#F46E58]'

        return(
            <div className="relative flex justify-center py-3">

                <div className="w-[50%] space-y-2 text-right text-xs sm:text-sm">
                    <div className={`${leftWR > rightWR ? 'font-bold' : 'opacity-75'} ${lWRColor} px-6`}>{leftWR}% <span className="text-cyan-300">WR</span></div>
                    <div className="text-xs sm:text-lg pr-8 py-1">
                        <div 
                            className={`absolute right-1/2 -mt-1.5 h-10 bg-slate-800 rounded-l-md ${leftWR > rightWR ? 'border border-cyan-300/50' : null}`} 
                            style={{ width: `${leftPR}px`}}
                        />
                        <div className="relative">{left.Talent}</div>
                    </div>
                    <div className="px-6">{left.Matches.toLocaleString()} <span className="text-cyan-300">Matches</span></div>
                </div>
                

                <div className="z-30 absolute left-1/2 -translate-x-1/2 py-4">
                    <div className="rounded-full bg-slate-800 h-full py-3 px-3.5 text-lg sm:text-2xl border border-cyan-300/50">
                        {level}
                    </div>
                </div>


                <div className="w-[50%] space-y-2 text-xs sm:text-sm">
                    <div className={`${leftWR < rightWR ? 'font-bold' : 'opacity-75'} ${rWRColor} px-6`}>{rightWR}% <span className="text-cyan-300">WR</span></div>
                    <div className="text-xs sm:text-lg pl-8 py-1">
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
    } else {
        return(<div className="relative flex justify-center py-3 text-lg">
            No data for these talents
        </div>)
    }
}