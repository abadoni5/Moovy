import React from 'react'
import { useGetMovieQuery } from '../../services/TMDB'
import { Modal, Typography, Box, Button, ButtonGroup, Grid, CircularProgress, useMediaQuery, Rating } from '@mui/material'
import { Movie as MovieIcon, Theaters, Language, PlusOne, Favorite, FavoriteBorderOutlined, Remove, ArrowBack } from '@mui/icons-material'
import { Link, useParams } from 'react-router-dom'
import genreIcons from '../../assets/genres'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { ClassNames } from '@emotion/react'
import useStyles from './styles'
import { selectGenreOrCategory } from "../../features/currentGenreOrCategory";

const MovieInformation = () => {
  const { id } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { data, isFetching, error } = useGetMovieQuery(id);

  if (isFetching) {
    <Box display='flex' justifyContent='center' alignItems="center">
      <CircularProgress size="8rem" />
    </Box>
  }

  if (error) {
    <Box display='flex' justifyContent='center' alignItems="center">
      <Link to='/'> Something has gone wrong go back </Link>
    </Box>
  }

  return (
    <>
      <Grid container className={classes.containerSpaceAround}>
        <Grid item sm={12} lg={4} align='center'>
          <img src={`https://image.tmdb.org/t/p/w500${data?.poster_path}`} alt={data?.title} className={classes.poster} />
        </Grid>
        <Grid item container direction="column" lg={7}>
          <Typography variant='h3' align="center" gutterBottom>{data?.title} ({(data?.release_date.split('-')[0])})</Typography>
          <Typography variant='h5' align="center" gutterBottom>{data?.tagline}</Typography>
          <Grid item className={classes.containerSpaceAround}>
            <Box display="flex" align='center'>
              <Rating readOnly value={data?.vote_average / 2} precision={0.1} />
              <Typography variant='subtitle1' sx={{ marginLeft: '10px' }} gutterBottom>{Math.round(data?.vote_average * 10) / 10}/10</Typography>
            </Box>
            <Typography variant="h6" align="center" gutterBottom>
              {data?.runtime}min / {data?.spoken_languages.length > 0 ? data?.spoken_languages[0].name : ''}
            </Typography>
          </Grid>
          <Grid item className={classes.genresContainer}>
            {data?.genres?.map((genre, i) => (
              <Link key={genre.name} className={classes.links} to="/" onClick={() => dispatch(selectGenreOrCategory(value))}>
                <img
                  src={genreIcons[genre.name.toLowerCase()]}
                  height={30}
                  className={classes.genreImage}
                />
                <Typography color="textPrimary" variant="subtitle1">
                  {genre?.name}
                </Typography>
              </Link>
            ))}
          </Grid>
          <Typography gutterBottom varaint="h5" sx={{ marginTop: '10px' }}>
            Overview
          </Typography>
          <Typography sx={{ marginBottom: '2rem' }}>
            {data?.overview}
          </Typography>
          <Typography gutterBottom varaint="h5" sx={{ marginTop: '10px' }}>
            Top Cast
          </Typography>
          <Grid item container spacing={2}>
            {data && data?.credits?.cast?.map((character, i) => (
              character.profile_path && (
                <Grid key={i} item xs={4} md={2} component={Link} to={`/actors/${character.id}`} style={{ textDecoration: 'none' }}>
                  <img
                    className={classes.castImage}
                    src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`}
                    alt={character.name}
                  />
                  <Typography color="textPrimary" align="center">{character?.name}</Typography>
                  <Typography color="textSecondary" align="center">
                    {character.character.split('/')[0]}
                  </Typography>
                </Grid>
              )
            )).slice(0, 6)}
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default MovieInformation
