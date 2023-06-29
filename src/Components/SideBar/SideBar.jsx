import React, { useEffect } from "react";
import {
  Divider, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Box, CircularProgress } from "@mui/material";
import genreIcons from '../../assets/genres'

import { Link } from "react-router-dom";
import { useTheme } from "@mui/styles";

import useStyles from "./styles.js";
import { useGetGenresQuery } from "../../services/TMDB.js";
import { useDispatch, useSelector } from "react-redux";
import { selectGenreOrCategory } from "../../features/currentGenreOrCategory";
import lightLogo from "../../assets/Logos/lightLogo.png";
import darkLogo from "../../assets/Logos/darkLogo.png";

const categories = [
  { label: "Popular", value: "popular" },
  { label: "Top Rated", value: "top_rated" },
  { label: "Upcoming", value: "upcoming" },
];


const SideBar = ({ setMobileOpen }) => {
  const {genreIdOrCategoryName} = useSelector((state) => state.currentGenreOrCategory);
  const theme = useTheme();
  const classes = useStyles();
  const { data, isFetching } = useGetGenresQuery();
  const dispatch = useDispatch();


  return (
    <>
      <Link to="/" className={classes.imageLink}>
        <img
          src={theme.palette.mode === "light" ? lightLogo : darkLogo }
          alt="Filmpire Logo"
          className={classes.image}
        />
      </Link>
      <Divider />
      <List>
        <ListSubheader>Categories</ListSubheader>
        {categories.map(({ label, value }) => (
          <Link key={value} className={classes.links} to="/">
            <ListItem onClick={() => dispatch(selectGenreOrCategory(value))} button>
              <ListItemIcon>
                    <img src={genreIcons[label.toLowerCase()]} height={30} className={classes.genreImage} />
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      <List>
        <ListSubheader>Genres</ListSubheader>
        {isFetching ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          data.genres.map(({ name, id }) => (
            <Link key={name} className={classes.links} to="/">
              <ListItem onClick={() => dispatch(selectGenreOrCategory(id))} button>
                <ListItemIcon>
                  <img
                    src={genreIcons[name.toLowerCase()]}
                    height={30}
                    className={classes.genreImage}
                  />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            </Link>
          ))
        )}
      </List>
    </>
  );
};

export default SideBar;
