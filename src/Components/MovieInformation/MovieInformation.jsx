import React from 'react'
import { useGetMovieQuery, useGetRecommendationsQuery } from '../../services/TMDB'
import { styled, Modal, Typography, Box, Button, ButtonGroup, Grid, CircularProgress, useMediaQuery, Rating } from '@mui/material'
import { Movie as MovieIcon, Theaters, Language, PlusOne, Favorite, FavoriteBorderOutlined, Remove, ArrowBack } from '@mui/icons-material'
import { Link, useParams } from 'react-router-dom'
import genreIcons from '../../assets/genres'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { ClassNames } from '@emotion/react'
import useStyles from './styles'
import { useState } from 'react'
import { MovieList } from '..'
import { selectGenreOrCategory } from "../../features/currentGenreOrCategory";
import { userSelector } from '../../Features/auth'
import { useGetListQuery } from '../../services/TMDB'
import { useEffect } from 'react'

const MovieInformation = () => {

  const CustomButtonGroup = styled(ButtonGroup)(({ theme }) => ({
    '& .MuiButton-outlined': {
      borderColor: theme.palette.mode === 'dark' ? 'white' : 'black',
    },
  }));

  const { id } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { data: recommendations, isFetching: isRecommendationsFetching } = useGetRecommendationsQuery({ list: '/recommendations', movie_id: id });
  const [open, setOpen] = useState(false);
  const { data, isFetching, error } = useGetMovieQuery(id);
  const { user } = useSelector(userSelector);

  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  const [isMovieWatchlisted, setIsMovieWatchlisted] = useState(false);

  const { data: favoriteMovies } = useGetListQuery({ listName: 'favorite/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 });
  const { data: watchlistMovies } = useGetListQuery({ listName: 'watchlist/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 });

  useEffect(() => {
    setIsMovieFavorited(!!favoriteMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [favoriteMovies, data]);
  useEffect(() => {
    setIsMovieWatchlisted(!!watchlistMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [watchlistMovies, data]);

  const addToFavorites = async () => {
    await axios.post(`https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${import.meta.env.VITE_TMDB_KEY}&session_id=${localStorage.getItem('session_id')}`, {
      media_type: 'movie',
      media_id: id,
      favorite: !isMovieFavorited,
    });
    setIsMovieFavorited((prev) => !prev);
  };

  const addToWatchList = async () => {
    await axios.post(`https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${import.meta.env.VITE_TMDB_KEY}&session_id=${localStorage.getItem('session_id')}`, {
      media_type: 'movie',
      media_id: id,
      watchlist: !isMovieWatchlisted,
    });

    setIsMovieWatchlisted((prev) => !prev);
  };

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
              {data?.runtime}min | Language: {data?.spoken_languages[0].name}
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
          <Grid item container style={{ marginTop: '2rem' }}>
            <div className={classes.buttonsContainer} >
              <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
                <CustomButtonGroup sx={{ borderColor: (theme) => theme.palette.common.black }} size="small" variant="outlined">
                  <Button className={classes.buttons} target="_blank" rel="noopener noreferrer" href={data?.homepage} endIcon={<Language />}>
                    Website
                  </Button>
                  <Button className={classes.buttons} target="_blank" rel="noopener noreferrer" href={`https://www.imdb.com/title/${data?.imdb_id}`} endIcon={<MovieIcon />}>
                    IMDB
                  </Button>
                  <Button className={classes.buttons} onClick={() => setOpen(true)} href="#" endIcon={<Theaters />}>
                    Trailer
                  </Button>
                </CustomButtonGroup>
              </Grid>
              <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
                <CustomButtonGroup size="small" variant="outlined">
                  <Button className={classes.buttons} onClick={addToFavorites} endIcon={isMovieFavorited ? <FavoriteBorderOutlined /> : <Favorite />}>
                    {isMovieFavorited ? 'Unfavorite' : 'Favorite'}
                  </Button>
                  <Button className={classes.buttons} onClick={addToWatchList} endIcon={isMovieWatchlisted ? <Remove /> : <PlusOne />}>
                    Watchlist
                  </Button>
                  <Button endIcon={<ArrowBack />} sx={{ borderColor: 'primary.main' }} className={classes.buttons}>
                    <Typography variant="subtitle2" component={Link} to="/" color="inherit" sx={{ textDecoration: 'none' }}>
                      Back
                    </Typography>
                  </Button>
                </CustomButtonGroup>
              </Grid>
            </div>
          </Grid>
        </Grid>
        <Box marginTop="5rem" width="100%">
          <Typography variant="h3" gutterBottom align='center'>
            Similar Movies you might enjoy
          </Typography>
          {recommendations ? <MovieList movies={recommendations} numberOfMovies={12} /> : <Box>Sorry, no matches were found. </Box>}
        </Box>
        {data?.videos?.results.length > 0 && (
          <Modal closeAfterTransition className={classes.modal} open={open} onClose={() => setOpen(false)}>
            <iframe
              autoPlay
              className={classes.video}
              frameBorder="0"
              title="Trailer"
              src={`https://www.youtube.com/embed/${data?.videos?.results[0].key}`}
              allow="autoplay"
            />
          </Modal>
        )}

      </Grid>
    </>
  )
}

export default MovieInformation
