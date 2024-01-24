// DrinkDetails.tsx
import React from 'react';

interface DrinkDetailsProps {
    drink: any; // Adjust the type based on the API response
    onClose: () => void;
}

const DrinkDetails: React.FC<DrinkDetailsProps> = ({ drink, onClose }) => {
    return (
        <div>
            <h2>{drink.strDrink}</h2>
            <p>{drink.strInstructions}</p>
            {/* Include other details as needed */}
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default DrinkDetails;
