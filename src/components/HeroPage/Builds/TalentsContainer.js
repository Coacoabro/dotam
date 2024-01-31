import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import client from '../../../pages/_app';

const TalentsContainer = ({heroID, rank, role}) => {

  const [infoChange, setInfoChange] = useState(true); 

  useEffect(() => {
    setInfoChange(true);
  }, [rank, role]);


  

  return(
    <div>
      Talents
    </div>
  
  );
};

export default TalentsContainer;
