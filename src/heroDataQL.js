import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { AM_STATS } from "./graphQL/Queries";

const GetMatches = () => {
  const { data } = useQuery(AM_STATS);
  const [amMatchCount, setMatchCount] = useState(0);

  useEffect(() => {
    if (data) {
      console.log(data);
      data.heroStats.winGameVersion.forEach((winGameVersion) => {
        if (winGameVersion.gameVersionId === 169) {
          setMatchCount(winGameVersion.matchCount);
        }
      });
    }
  }, [data]);

  return amMatchCount;
};

export default GetMatches;