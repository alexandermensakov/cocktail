// Search.tsx
import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import axios from 'axios';

interface SearchProps {
    onSearch: (results: any[]) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedIngredient, setSelectedIngredient] = useState<string>('');
    const [categories, setCategories] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<string[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
                setCategories(['', ...response.data.drinks.map((category: any) => category.strCategory)]);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchIngredients = async () => {
            try {
                const response = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list');
                setIngredients(['', ...response.data.drinks.map((ingredient: any) => ingredient.strIngredient1)]);
            } catch (error) {
                console.error('Error fetching ingredients:', error);
            }
        };

        fetchCategories();
        fetchIngredients();
    }, []);
    const handleSearch = async () => {
        try {
            let apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?';

            // Include search term if available
            if (searchTerm) {
                apiUrl += `s=${searchTerm}`;
            }

            // If there's a category or ingredient selected, just clear the search term
            if (selectedCategory || selectedIngredient) {
                apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?';

                if (selectedCategory) {
                    apiUrl += `${selectedIngredient ? '&' : ''}c=${selectedCategory}`;
                }

                if (selectedIngredient) {
                    apiUrl += `${selectedCategory ? '&' : ''}i=${selectedIngredient}`;
                }
            }

            const response = await axios.get(apiUrl);
            onSearch(response.data.drinks || []);
        } catch (error) {
            console.error('Error fetching cocktails:', error);
        }
    };


    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
                <TextField
                    fullWidth
                    label="Search for cocktails"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Grid>
            <Grid item xs={4}>
                <FormControl fullWidth>
                    <InputLabel id="category-label">Select Category</InputLabel>
                    <Select
                        labelId="category-label"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as string)}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={4}>
                <FormControl fullWidth>
                    <InputLabel id="ingredient-label">Select Ingredient</InputLabel>
                    <Select
                        labelId="ingredient-label"
                        value={selectedIngredient}
                        onChange={(e) => setSelectedIngredient(e.target.value as string)}
                    >
                        {ingredients.map((ingredient) => (
                            <MenuItem key={ingredient} value={ingredient}>
                                {ingredient}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
                <Button variant="outlined" onClick={handleSearch}>
                    Search
                </Button>
            </Grid>
        </Grid>
    );
};

export default Search;
