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
        // const lWRColor = leftWR >= 51.5 ? 'text-[#64C15B]' 
        // : leftWR >= 48.5 ? 'text-slate-200'
        // : 'text-[#F46E58]'
        // const rWRColor = rightWR >= 51.5 ? 'text-[#64C15B]' 
        // : rightWR >= 48.5 ? 'text-slate-200'
        // : 'text-[#F46E58]'

        return(
            <div className="relative flex justify-center py-3">

                <div className="w-[50%] space-y-2 text-right text-xs sm:text-sm">
                    <div className={`
                        ${leftWR > rightWR ? 'font-bold text-[#64C15B]' : 'opacity-75'} 
                        px-6
                    `}>
                            {leftWR}% <span className="text-[#8293A7]">WR</span>
                    </div>
                    <div className="text-xs sm:text-lg pr-8 py-1">
                        <div className="">
                            <div 
                                style={{ width: `${leftPR}px`}}
                                className={`
                                    absolute right-1/2 -mt-1.5 h-[36px] bg-left-talent-gradient rounded-l-md 
                                    ${leftWR > rightWR ? '' : null}
                                `} 
                                
                            />
                        </div>
                        
                        <div className="relative">
                            {left.Talent}
                        </div>
                    </div>
                    <div className="px-6">{left.Matches.toLocaleString()} <span className="text-[#8293A7]">Matches</span></div>
                </div>
                

                <div className="flex items-center justify-center z-10 h-[83px] w-[83px] bg-talent-circle-border rounded-full shadow-[0px_0px_40px_0px_rgba(255,255,255,0.12)]">
                    <div className="bg-slate-950 rounded-full ">
                        <div className="rounded-full h-[80px] w-[80px] bg-[#15172866] text-[28px]/[40px] flex items-center justify-center text-cyan-300">
                            {level}
                        </div>
                    </div>
                </div>


                <div className="w-[50%] space-y-2 text-xs sm:text-sm">
                    <div className={`${leftWR < rightWR ? 'font-bold text-[#64C15B]' : 'opacity-75'} px-6`}>{rightWR}% <span className="text-[#8293A7]">WR</span></div>
                    <div className="text-xs sm:text-lg pl-8 py-1">
                        <div 
                            className={`absolute left-1/2 -mt-1.5 h-10 rounded-r-md bg-right-talent-gradient ${leftWR < rightWR ? '' : null}`} 
                            style={{ width: `${rightPR}px`}}
                        />
                        <div className="relative">{right.Talent}</div>
                    </div>
                    <div className="px-6">{right.Matches.toLocaleString()} <span className="text-[#8293A7]">Matches</span></div>
                </div>

            </div>
        )
    } else {
        return(<div className="relative flex justify-center py-3 text-lg">
            No data for these talents
        </div>)
    }
}