import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';

const products = ['scheduler', 'extractAI', 'Dashboard', 'Events', 'Calendars', 'Messages'];
const resources = ['roadmap', 'PCD', 'jira', 'report'];

const CustomAutocomplete = () => {
    const [inputValue, setInputValue] = useState('');
    const [searchWords, setSearchWords] = useState([]);
    const [options, setOptions] = useState(products);
    const [filteredOptions, setFilteredOptions] = useState(products);
    const [showOptions, setShowOptions] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const handleInputChange = (event) => {
        const newInputValue = event.target.value;
        setInputValue(newInputValue);
        setAnchorEl(event.currentTarget);

        const trimmedValue = newInputValue.trim();
        const words = trimmedValue.split(' ');
        const currentWord = words[words.length - 1];
        const hasTrailingSpace = newInputValue.endsWith(' ');

        if (hasTrailingSpace && words.length === 1) {
            setSearchWords([trimmedValue]);
            setOptions(resources);
            setFilteredOptions(resources);
            setShowOptions(true);
        } else if (hasTrailingSpace && words.length === 2) {
            console.log(`Searching for: ${searchWords[0]} ${currentWord}`);
            setSearchWords([]);
            setOptions(products);
            setInputValue('');
            setShowOptions(false);
        } else {
            setFilteredOptions(options.filter(option => option.toLowerCase().includes(currentWord.toLowerCase())));
            setShowOptions(true);
        }
    };

    const handleOptionClick = (option) => {
        const trimmedValue = inputValue.trim();
        const words = trimmedValue.split(' ');

        if (words.length === 1) {
            setInputValue(option + ' ');
            setSearchWords([option]);
            setOptions(resources);
            setFilteredOptions(resources);
        } else if (words.length === 2) {
            const firstWord = searchWords[0];
            setInputValue(`${firstWord} ${option} `);
            console.log(`Searching for: ${firstWord} ${option}`);
            setSearchWords([]);
            setOptions(products);
            setShowOptions(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowDown') {
            setHighlightedIndex((prevIndex) => (prevIndex + 1) % filteredOptions.length);
        } else if (event.key === 'ArrowUp') {
            setHighlightedIndex((prevIndex) => (prevIndex - 1 + filteredOptions.length) % filteredOptions.length);
        } else if (event.key === 'Enter') {
            handleOptionClick(filteredOptions[highlightedIndex]);
            setHighlightedIndex(0);
        }
    };

    const handleClickAway = () => {
        setShowOptions(false);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#242424', flexDirection: 'column' }}>
            <ClickAwayListener onClickAway={handleClickAway}>
                <div>
                    <TextField
                        label="Search"
                        variant="outlined"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
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
                    <Popper open={showOptions} anchorEl={anchorEl} style={{ zIndex: 1, width: 300 }}>
                        <Paper>
                            <List>
                                {filteredOptions.map((option, index) => (
                                    <ListItem
                                        button
                                        key={index}
                                        selected={index === highlightedIndex}
                                        onClick={() => handleOptionClick(option)}
                                    >
                                        <ListItemText primary={option} />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Popper>
                </div>
            </ClickAwayListener>
        </Box>
    );
};

export default CustomAutocomplete;
