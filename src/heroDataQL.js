import { ApolloClient, InMemoryCache, createHttpLink, gql, useQuery } from '@apollo/client';

const httpLink = createHttpLink({
    uri: 'https://api.stratz.com/graphiql/',
  });

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdWJqZWN0IjoiZWNmMWMxNTktMzk5Yy00N2UzLWEyMTktNzZkNjA5MDNmMGE5IiwiU3RlYW1JZCI6Ijk2MTcwMTk2IiwibmJmIjoxNzAyNDM3NzczLCJleHAiOjE3MzM5NzM3NzMsImlhdCI6MTcwMjQzNzc3MywiaXNzIjoiaHR0cHM6Ly9hcGkuc3RyYXR6LmNvbSJ9.JKQ92J9j9QTh5HPtD8sxCSGkbOViKKuCtuBCD2QN0Yk';

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    headers: {
      authorization: `Bearer ${apiKey}`,
    },
  });

export const fetchHeroPickRate = async ({heroID}) => {
    

    const GET_HERO_PICK_RATE = gql`
        {
            heroStats {
                winMonth {
                  heroId
                  matchCount
                }
              }
        }
    `;
  
    try {
        const { data } = await client.query({
          query: GET_HERO_PICK_RATE,
        });

        

        const heroStats = data.heroStats.winMonth;
        const totalMatches = heroStats.reduce((accumulator, hero) => accumulator + hero.matchCount, 0);
        const targetHero = heroStats.find(hero => hero.heroId === heroID)
        const pickRate = (targetHero.matchCount / totalMatches) * 100        
    
        return pickRate;

      } catch (error) {
        console.error('Error fetching data:', error);
        return null;
      }

}