import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import client from '../../../pages/_app';

const AbilitiesContainer = ({heroID, rank, role}) => {

/*
  const BUILD_STATS = gql`
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
                guide(heroId: ${heroID}) {
                  guides(take: 100) {
                    heroId
                    match {
                      players {
                        heroId
                        level
                        position
                        abilities {
                          abilityId
                          level
                          abilityType {
                            name
                            isTalent
                          }
                        }
                        stats {
                          itemPurchases {
                            itemId
                            time
                          }
                        }
                        item0Id
                        item1Id
                        item2Id
                        item3Id
                        item4Id
                        item5Id
                        backpack0Id
                        backpack1Id
                        backpack2Id
                      }
                    }
                  }
                }
              }
          }
      `;

  

  
  const { data } = useQuery(BUILD_STATS);


  useEffect(() => {
    if(data){
      let abilityOrderList = []

      data.heroStats.guide[0].guides.forEach((guides) => {
        guides.match.players.forEach((players) => {
          let i = 0
          abilityOrderList[i] = []
          if(players.heroId === heroID) {
            abilityOrderList[i][0] = []
            abilityOrderList[i][0].push(players.level)
            let j = 1
            players.abilities.forEach((abilities) => {
              abilityOrderList[i][j] = []
              abilityOrderList[i][j].push(abilities.abilityId)
              j += 1
            })
            i += 1
          }
        })
      })
    }


  },[data]);
  */

  return(
    <div>
      Abilities
    </div>
  
  );
};

export default AbilitiesContainer;
