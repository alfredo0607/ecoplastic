import React from "react";

import { LinearProgress } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import ProgressBarWithLabel from "./ProgressBarWithLabel";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    background:
      theme.palette.mode === "light"
        ? "rgba(255, 255, 255, 0.3)"
        : "rgba(255, 255, 255, 0.07)",
    width: "100%",
    height: "100%",
    top: "0",
    left: "0",
    zIndex: "100",
  },
}));

const LoadingForms = ({ value = null }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {value ? (
        <ProgressBarWithLabel value={value} />
      ) : (
        <LinearProgress color="secondary" />
      )}
    </div>
  );
};

export default LoadingForms;
