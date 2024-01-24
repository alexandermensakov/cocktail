// CocktailSearch.tsx
import React, { useState } from 'react';
import { Typography, Grid, Card, CardContent, CardMedia, Modal, Box, List, ListItem, Button } from '@mui/material';
import axios from 'axios';
import Search from './Search';

interface Cocktail {
    idDrink: string;
    strDrink: string;
    strDrinkThumb: string;
    strInstructions: string;
    strIngredient1: string;
    strIngredient2: string;
    strMeasure1: string;
    strMeasure2: string;
    // Include other details as needed
}

const CocktailSearch: React.FC = () => {
    const [cocktails, setCocktails] = useState<Cocktail[]>([]);
    const [selectedDrink, setSelectedDrink] = useState<Cocktail | null>(null);

    const handleSearchResults = (results: Cocktail[]) => {
        // Add the 'expanded' property to each Cocktail object
        const cocktailsWithExpanded = results.map((cocktail) => ({ ...cocktail, expanded: false }));
        setCocktails(cocktailsWithExpanded);
    };

    const handleCardClick = async (idDrink: string) => {
        try {
            const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idDrink}`);
            const selectedDrink = response.data.drinks[0];
            setSelectedDrink(selectedDrink);
        } catch (error) {
            console.error('Error fetching drink details:', error);
        }
    };

    const handleCloseDetails = () => {
        setSelectedDrink(null);
    };

    const handleRandomDrink = async () => {
        try {
            const response = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php');
            const randomDrink = response.data.drinks[0];
            setCocktails([randomDrink]);
            setSelectedDrink(randomDrink);
        } catch (error) {
            console.error('Error fetching random drink:', error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom style={{ marginBottom: '20px' }}>
                Cocktail Search
            </Typography>
            <div style={{ textAlign: 'center' }}>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={4}>
                        <Search onSearch={handleSearchResults} />
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="outlined" onClick={handleRandomDrink}>
                            Random Drink
                        </Button>
                    </Grid>
                </Grid>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '20px' }}>
                {cocktails.map((cocktail) => (
                    <Grid item xs={4} key={cocktail.idDrink}>
                        <Card
                            style={{ margin: '10px', width: '90%', maxWidth: '400px', cursor: 'pointer' }}
                            onClick={() => handleCardClick(cocktail.idDrink)}
                        >
                            <CardMedia
                                component="img"
                                height="120px" // Adjust the height as needed
                                width="100%" // Adjust the width as needed
                                image={cocktail.strDrinkThumb}
                                alt={cocktail.strDrink}
                            />
                            <CardContent>
                                <Typography variant="h6">{cocktail.strDrink}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </div>
            <Modal open={!!selectedDrink} onClose={handleCloseDetails}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        width: '70%', // Adjust the width as needed
                        maxWidth: '600px', // Adjust the maximum width as needed
                        maxHeight: '80vh', // Adjust the maximum height as needed
                        overflowY: 'auto', // Enable vertical scrolling
                    }}
                >
                    <Typography variant="h4">{selectedDrink?.strDrink}</Typography>
                    <CardMedia
                        component="img"
                        height="500px" // Keep the height at 500px
                        width="100%" // Adjust the width as needed
                        image={selectedDrink?.strDrinkThumb}
                        alt={selectedDrink?.strDrink}
                    />
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ flex: 1 }}>
                            <Typography variant="h6">Ingredients:</Typography>
                            <List>
                                {Array.from({ length: 15 }, (_, index) => index + 1).map((index) => (
                                    <ListItem key={index}>
                                        {selectedDrink?.[`strIngredient${index}`]}{' '}
                                        {selectedDrink?.[`strMeasure${index}`]}
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                        <div style={{ flex: 1, paddingLeft: '20px' }}>
                            <Typography variant="h6">Instructions:</Typography>
                            <Typography style={{ whiteSpace: 'pre-line' }}>{selectedDrink?.strInstructions}</Typography>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default CocktailSearch;
