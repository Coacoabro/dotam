

export default function Hero() {
    return(
        <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 25, display: 'flex'}}>
            <img style={{width: 508, height: 153}} src="/DotamLogoLight.png" />
            <div style={{width: 580, height: 70, textAlign: 'center', fontSize: 16, wordWrap: 'break-word'}}>
                DotaM is a stats based website dedicated to Dota 2 players, featuring a database of stats and successful builds that benefit both newbies and experienced players.
            </div>
        </div>
    )
}