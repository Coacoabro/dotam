import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import client from '../../../pages/_app';

const AbilitiesContainer = ({heroID, rank, role}) => {


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
                          time
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
      let itemOrderList = []

      console.log(data)

      data.heroStats.guide[0].guides.forEach((guides) => {
        guides.match.players.forEach((players) => {
          if(players.heroId === heroID) {
            let abilityOrder = []
            let i = 1
            players.abilities.forEach((abilities) => {
              abilityOrder.push({"Level": i, "Ability": abilities.abilityId})
              i += 1
            })
            abilityOrderList.push(abilityOrder)
          }
        })
        
      })

      console.log(abilityOrderList)
    }


  },[data]);

  return(
    <div>
      Abilities
    </div>
  
  );
};

export default AbilitiesContainer;
