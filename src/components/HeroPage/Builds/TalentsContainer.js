import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';

const TalentsContainer = (heroID, rank, role) => {

  const [infoChange, setInfoChange] = useState(true);  
  const [talentID, setTalentID] = useState(0);

  useEffect(() => {
    setInfoChange(true);
  }, [rank, role]);

  const TALENT_STATS = gql`
          query{
              heroStats {
              talent(
                  ${role ? `positionIds: ${role}` : ''}
                  ${rank ? `bracketIds: ${rank}` : ''}
              ) {
                abilityId
                matchCount
                winCount
              }
              }
          }
      `;

  const TALENT_INFO = gql`
          query{
              heroStats {
              constants {
                ability(id: ${talentID}) {
                  name
                  language {
                    displayName
                  }
                }
              }
            }
            
          }
      `;

  return(
    <div>
      Talents
    </div>
  
  );
};

export default TalentsContainer;
