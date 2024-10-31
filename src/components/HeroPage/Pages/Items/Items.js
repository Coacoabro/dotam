import Core from "./Core/Core"
import Early from "./Early/Early"
import Neutrals from "./Neutrals/Neutrals"
import Starting from "./Starting/Starting"

export default function Items({ initRole, initFacet, heroData, heroBuilds }) {

    console.log(heroBuilds)

    return(
        <div className="space-y-4">
            <div className="flex gap-2">
                <div className="w-2/5"><Starting hero={heroData} items={heroBuilds.starting} /></div>
                <div className="w-3/5"><Early hero={heroData} items={heroBuilds.early} /></div>
            </div>
            <Core hero={heroData} items={heroBuilds.core} />
            <Neutrals hero={heroData} items={heroBuilds.neutrals} />
        </div>
    )
}