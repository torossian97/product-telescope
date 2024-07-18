import React from 'react';
import Box from '@mui/material/Box';
import Search from './components/Search';

function App() {
    return (
        <Box sx={{ display: 'flex', width:"100vw", justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#242424' }}>
            <Search />
        </Box>
    );
}

export default App;
