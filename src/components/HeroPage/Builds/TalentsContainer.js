import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import client from '../../../pages/_app';

const TalentsContainer = ({heroID, rank, role}) => { 

  return(
    <div>
      TALENTS
      <h1>10: +9 Strength</h1>
      <h2>15: -1s Blink Cooldown</h2>
      <h3>20: +150 Blink Cast Range</h3>
      <h4>25: +20% Counterspell Magic Resistance</h4>
    </div>
  
  );
};

export default TalentsContainer;
