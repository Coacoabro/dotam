
const RankRow = ({ dotaRank, dotaClass, leagueRank }) => (
  <div className="grid grid-cols-2 p-2 border-b border-neutral-700">
    <div>{leagueRank}</div>
    <div className={`font-bold`}>{dotaRank}</div>
  </div>
)

export default function DotaLeagueRankTable() {
  return (
    <div className="space-y-4">
        <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900 w-1/2">
            <div className="grid grid-cols-2 bg-slate-800 p-2 font-semibold text-slate-200">
                <div>League of Legends Rank</div>
                <div>Dota 2 Rank</div>
            </div>
            <RankRow dotaRank="Herald 1–5" dotaClass="text-brown-300" leagueRank="Iron IV – Bronze III" mmr="0-769 MMR" />
            <RankRow dotaRank="Guardian 1–5" dotaClass="text-gray-300" leagueRank="Bronze II – Silver IV" mmr="770-1539 MMR" />
            <RankRow dotaRank="Crusader 1–5" dotaClass="text-green-300" leagueRank="Silver III – Gold IV" mmr="1540-2309 MMR" />
            <RankRow dotaRank="Archon 1–5" dotaClass="text-blue-300" leagueRank="Gold III – Platinum IV" mmr="2310-3079 MMR" />
            <RankRow dotaRank="Legend 1–5" dotaClass="text-purple-300" leagueRank="Platinum III – Emerald IV" mmr="3080-3849 MMR" />
            <RankRow dotaRank="Ancient 1–5" dotaClass="text-yellow-300" leagueRank="Emerald III – Diamond IV" mmr="3850-4619 MMR" />
            <RankRow dotaRank="Divine 1–5" dotaClass="text-pink-300" leagueRank="Diamond III – Master 0 LP" mmr="4620-5419 MMR" />
            <RankRow dotaRank="Immortal" dotaClass="text-red-300" leagueRank="Master+" mmr="5420+ MMR" />
        </div>

        <div className="">
            These comparisons are estimates based on average skill and MMR distribution.
        </div>
    </div>
  )
}
