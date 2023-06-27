import React from 'react'
import { useSelector } from 'react-redux'
import { userSelector } from '../../Features/auth';
import { Typography, Button, Box } from '@mui/material';
import { useEffect } from 'react';
import { ExitToApp } from '@mui/icons-material';

const FavouriteMovies = [];

const Profile = () => {
    const { user } = useSelector(userSelector);
    const logout = () => { 
        localStorage.clear();
        window.location.href = '/';
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between">
                <Typography variant="h4" gutterBottom>My Profile</Typography>
                <Button color="inherit" onClick={logout}>Logout &nbsp; <ExitToApp /></Button>
            </Box>
            {!FavouriteMovies.length ? (<Typography variant="h5">Add favorites or watchlist some movies to see them here</Typography>) : <Box>FAVORITE MOVIES</Box>}
        </Box>
    )
}

export default Profile
