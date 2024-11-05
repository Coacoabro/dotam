import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import Core from "./Core/Core"
import Early from "./Early/Early"
import Neutrals from "./Neutrals/Neutrals"
import Starting from "./Starting/Starting"

export default function Items({ initRole, initFacet, heroData, heroBuilds, current_patch }) {

    const router = useRouter()
    const { role, rank, patch, facet } = router.query

    const [currBuild, setCurrBuild] = useState(heroBuilds.find((obj) => obj.role == role || initRole && obj.rank == rank || "" && obj.facet == facet || initFacet && obj.patch == patch || current_patch))
    const [isCarry, setIsCarry] = useState(currBuild.role == 'POSITION_4' || currBuild.role == 'POSITION_5' ? false : true)

    useEffect(() => {

        const currRole = role || initRole
        const currRank = rank || ""
        const currPatch = patch || current_patch
        const currFacet = facet || initFacet

        setCurrBuild(heroBuilds.find((obj) => obj.role == currRole && obj.rank == currRank && obj.patch == currPatch && obj.facet == currFacet))
        if(currRole == 'POSITION_4' || currRole == 'POSITION_5'){
            setIsCarry(false)
        }
        else{setIsCarry(true)}

    }, [role, rank, patch, facet, heroBuilds])

    return(
        <div className="space-y-4">
            <div className="sm:flex gap-2 space-y-4 sm:space-y-0">
                <div className="w-3/4 mx-auto sm:w-1/4"><Starting hero={heroData} items={currBuild.starting} /></div>
                <div className="sm:w-3/4"><Early hero={heroData} items={currBuild.early} /></div>
            </div>
            <Core hero={heroData} items={currBuild.core} isCarry={isCarry} />
            <Neutrals hero={heroData} items={currBuild.neutrals} />
        </div>
    )
}