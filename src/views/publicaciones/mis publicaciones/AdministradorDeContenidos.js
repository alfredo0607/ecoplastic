import React from "react";

import { Typography, Paper, Grid } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import NuevaPublicacion from "./NuevaPublicacion";

const useStyles = makeStyles((theme) => ({
  titleText: {
    color:
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.7)"
        : "rgba(255, 255, 255, 0.9)",
  },
  input: {
    display: "none",
  },
  paper: {
    padding: theme.spacing(2),
  },
}));

function AdministradorDeContenidos(props) {
  const classes = useStyles();

  return (
    <Paper elevation={2} className={classes.paper}>
      <Grid container direction="row" alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography className={classes.titleText} variant="h1">
            Administrador de contenidos
          </Typography>
        </Grid>

        <Grid item xs={12} md={6} container justify="flex-end">
          <NuevaPublicacion
            setPublication={props.setPublication}
            addPublication={props.addPublication}
            formSettings={props.formSettings}
            updateFormSettings={props.updateFormSettings}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default AdministradorDeContenidos;
