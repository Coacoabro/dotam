import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import Core from "./Core/Core"
import Early from "./Early/Early"
import Neutrals from "./Neutrals/Neutrals"
import Starting from "./Starting/Starting"
import Ad from "../../../../components/Ads/Venatus/Ad"

export default function Items({ initRole, heroData, currBuild }) {

    const router = useRouter()
    const { role } = router.query

    const [currRole, setCurrRole] = useState(role || initRole)
    const [isCarry, setIsCarry] = useState(currRole == "POSITION_4" || currRole == "POSITION_5" ? false : true)

    useEffect(() => {
        if(role){setCurrRole(role)}
        if(currRole){setIsCarry(currRole == "POSITION_4" || currRole == "POSITION_5" ? false : true)}
    }, [role])

    console.log(currBuild)

    return(
        <div className="space-y-4">
            <div className="sm:flex gap-2 space-y-4 sm:space-y-0">
                <div className="w-3/4 mx-auto sm:w-1/4"><Starting hero={heroData} items={currBuild.starting} /></div>
                <div className="sm:w-3/4"><Early hero={heroData} items={currBuild.early} /></div>
            </div>

            <div className='sm:hidden flex justify-center align-items-center'>
                <Ad placementName="mobile_takeover" />
            </div>

            <Core hero={heroData} items={currBuild.core} isCarry={isCarry} />
            <Neutrals hero={heroData} items={currBuild.neutrals} />
        </div>
    )
}