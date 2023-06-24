import React from 'react';
import { useState, useEffect } from 'react';
import { Box, CircularProgress, useMediaQuery, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

import { useGetMoviesQuery } from '../../services/TMDB';    

const Movies = () => {

    const { data } = useGetMoviesQuery();

    console.log(data);

    return (
        <div>
            hi
        </div>
    )
}

export default Movies
