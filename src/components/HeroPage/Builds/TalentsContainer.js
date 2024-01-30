import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import client from '../../../pages/_app';

const TalentsContainer = ({heroID, rank, role}) => {

  const [infoChange, setInfoChange] = useState(true); 

  useEffect(() => {
    setInfoChange(true);
  }, [rank, role]);


  const TALENT_STATS = gql`
          query{
              constants {
                abilities {
                  language {
                    displayName
                  }
                  id
                  isTalent
                }
              }
              heroStats {
                talent(
                    heroId: ${heroID}
                    ${role ? `positionIds: ${role}` : ''}
                    ${rank ? `bracketIds: ${rank}` : ''}
                ) {
                  abilityId
                  matchCount
                  winsAverage
                }
              }
          }
      `;

  const { data } = useQuery(TALENT_STATS);

  useEffect(() => {
    if(data){
      console.log(data);
    }

  }, [data]);

  return(
    <div>
      Talents
    </div>
  
  );
};

export default TalentsContainer;
