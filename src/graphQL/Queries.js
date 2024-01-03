import { gql } from "@apollo/client";

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


export default AM_STATS;