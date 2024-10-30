

export default function Hero() {
    return(
        <div className="flex-col justify-start items-center gap-[25px] inline-flex">
            <img className="w-[300px] sm:w-[508px] sm:h-[153px]" src="/DotamLogoLight.png" />
            <div className="text-center w-[300px] sm:w-[580px]">
                DotaM is a stats-based website dedicated to experienced AND newer Dota 2 players, featuring a database of successful builds that are functionally showcased.
            </div>
        </div>
    )
}