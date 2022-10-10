import React from "react";
import { LinearProgress, Typography } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  subContainer: {
    width: 250,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

function LoadingScreen() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.subContainer}>
        <Typography variant="h5" color="textPrimary">
          Cargando ...
        </Typography>
        <LinearProgress />
      </div>
    </div>
  );
}

export default LoadingScreen;
