import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';

const products = ['scheduler', 'extractAI', 'Dashboard', 'Events', 'Calendars', 'Messages'];
const resources = ['roadmap', 'PCD', 'jira', 'report'];

const SearchBar = () => {
    const [inputValue, setInputValue] = useState('');
    const [searchWords, setSearchWords] = useState([]);
    const [options, setOptions] = useState(products);

    useEffect(() => {
        const trimmedValue = inputValue.trim();
        const words = trimmedValue.split(' ');
        const hasTrailingSpace = inputValue.endsWith(' ');

        if (hasTrailingSpace && words.length === 1) {
            // Switch to resource options after the first word
            setSearchWords([trimmedValue]);
            setOptions(resources);
        } else if (hasTrailingSpace && words.length === 2) {
            // Handle the final search action after the second word
            console.log(`Searching for: ${searchWords[0]} ${words[1]}`);
            setSearchWords([]);
            setOptions(products);
            setInputValue('');
        }
    }, [inputValue, searchWords, options]);

    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#242424' }}>
            <Autocomplete
                freeSolo
                options={options}
                inputValue={inputValue}
                onInputChange={handleInputChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search"
                        variant="outlined"
                        sx={{
                            width: 300,
                            input: { color: '#fff' },
                            label: { color: '#fff' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#fff',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#fff',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#fff',
                                },
                            },
                        }}
                    />
                )}
            />
        </Box>
    );
};

export default SearchBar;
