import React from "react";
import { Route, Routes } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import { Actors, Movies, NavBar, Profile, MovieInformation } from "./";
import useStyles from "./styles";

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <NavBar/>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Routes>
          <Route path="/" element={<Movies />} />
          <Route path="/approved" element={<Movies />} />
          <Route path="/movie/:id" element={<MovieInformation/>} />
          <Route path="/actors/:id" element={<Actors/>} />
          <Route path="/profile/:id" element={<Profile/>} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
