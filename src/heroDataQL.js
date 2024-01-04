import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";

const AM_STATS = gql`
    query{
        heroStats{
            winGameVersion(heroIds: 1){
                gameVersionId
                winCount
                matchCount
            }
        }
    }
`;


function GetMatches() {
  const [matchCount, setMatchCount] = useState(null);
  const { data } = useQuery(AM_STATS);

  useEffect(() => {
    if (data) {
      let highestGameVersionId = 0;
      data.heroStats.winGameVersion.forEach((winGameVersion) => {
        if (winGameVersion.gameVersionId > highestGameVersionId) {
          highestGameVersionId = winGameVersion.gameVersionId;
        }
      });

      data.heroStats.winGameVersion.forEach((winGameVersion) => {
        if (winGameVersion.gameVersionId === highestGameVersionId) {
          setMatchCount(winGameVersion.matchCount);
        }
      });
    }
  }, [data]);

  return (
    <div>
      <h1>{matchCount}</h1>
    </div>
  );

};

export default GetMatches;