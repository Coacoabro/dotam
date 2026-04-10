import MetaHero from "./MetaHero";

export default function MetaHeroes( {data, isLoading} ){

    if(isLoading) {
        return(
            <div className="flex justify-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div className="rounded-2xl bg-gradient-to-b from-[#1E2439] to-[#0B0D1C] p-4  w-[234px] h-[156px]" />
                ))}
            </div>
        )
    }

    else{

        return(
            <div className="flex justify-center gap-2">
                {Object.entries(data).map(([roleKey, heroData]) => (
                    <MetaHero role={roleKey} heroData={heroData} />
                ))}
            </div>
        )
    }
}