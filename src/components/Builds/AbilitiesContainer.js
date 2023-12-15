import React from 'react';

const HeroAbilities = () => {
    
    const abilities = [
        { name: 'ability_anti_mage_mana_break', level: 1 },
        { name: 'ability_anti_mage_blink', level: 2 },
        
    ];
  
  const popularOrder = [1, 2, 1, 3, 1, 4, 1, 3, 3, 3, 4, 2, 2, 2, 4, 2, 2]; // Sample popular order
  
  
  const isChosen = (level, abilityLevel) => {
    return popularOrder[level - 1] === abilityLevel;
  };

  return (
    <div className="flex flex-wrap">
      {abilities.map((ability, index) => (
        <div key={index} className="w-1/6 p-2 text-center">
          <img
            src={`path/to/ability/${ability.name}.png`}
            alt={ability.name}
            className={`h-16 w-16 rounded-full border ${isChosen(index + 1, ability.level) ? 'border-yellow-500' : 'border-gray-300'}`}
          />
          <p className="text-sm">{`Level ${ability.level}`}</p>
        </div>
      ))}
    </div>
  );
};

export default HeroAbilities;
