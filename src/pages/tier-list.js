import { useQuery } from 'react-query';

import TierLayout from '../components/TierList/TierLayout';
import TierContainer from '../components/TierList/TierContainer';

import LoadingWheel from '../components/LoadingWheel';

const fetchTierData = async (hero, type) => {
  const response = await fetch(`/api/tier-list`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export default function TierList() {


  const { data, isLoading } = useQuery(['tierList'], fetchTierData)

  return (
    <div>

      <TierLayout>

        {isLoading ? (<LoadingWheel />) : (
          <TierContainer heroes={data.heroes} rates={data.rates} matchups={data.matchups} />
        )}

      </TierLayout>

    </div>
  );
}

