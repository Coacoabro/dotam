import AbilityCard from '../AbilityCard'

export default function Aghanims({ hero, scepter, shard }) {

    

    return(
        <div className="flex">
            <AbilityCard hero={hero} ability={shard} type="Shard" />

            <AbilityCard hero={hero} ability={scepter} type="Scepter" />
        </div>
    )
}