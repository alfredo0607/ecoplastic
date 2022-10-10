import React from "react";
import { Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.primary,
  },
  smallText: {
    color: theme.palette.text.primary,
  },
}));

const FormTextRequired = () => {
  const classes = useStyles();
  return (
    <Typography className={classes.root} variant="caption" display="block">
      Los campos marcados con * son requeridos.
    </Typography>
  );
};

export default FormTextRequired;
