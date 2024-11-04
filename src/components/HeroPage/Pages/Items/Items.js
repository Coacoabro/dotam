import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import Core from "./Core/Core"
import Early from "./Early/Early"
import Neutrals from "./Neutrals/Neutrals"
import Starting from "./Starting/Starting"

export default function Items({ initRole, initFacet, heroData, heroBuilds, current_patch }) {

    const router = useRouter()
    const { role, rank, patch, facet } = router.query

    const [currBuild, setCurrBuild] = useState(heroBuilds.find((obj) => obj.role == initRole && obj.rank == "" && obj.facet == initFacet && obj.patch == current_patch))

    useEffect(() => {

        const currRole = role || initRole
        const currRank = rank || ""
        const currPatch = patch || current_patch
        const currFacet = facet || initFacet

        setCurrBuild(heroBuilds.find((obj) => obj.role == currRole && obj.rank == currRank && obj.patch == currPatch && obj.facet == currFacet))

    }, [role, rank, patch, facet, heroBuilds])

    return(
        <div className="space-y-4">
            <div className="flex gap-2">
                <div className="w-1/4"><Starting hero={heroData} items={currBuild.starting} /></div>
                <div className="w-3/4"><Early hero={heroData} items={currBuild.early} /></div>
            </div>
            <Core hero={heroData} items={currBuild.core} />
            <Neutrals hero={heroData} items={currBuild.neutrals} />
        </div>
    )
}