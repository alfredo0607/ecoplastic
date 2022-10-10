import * as React from "react";

import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

import DatabaseOffIcon from "mdi-material-ui/DatabaseOff";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    fontSize: theme.spacing(6),
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    color: theme.palette.divider,
  },
}));

const NoRows = ({ message }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <DatabaseOffIcon fontSize="inherit" color="inherit" />
      <Typography variant="body1" color="inherit">
        {message}
      </Typography>
    </div>
  );
};

export default NoRows;
