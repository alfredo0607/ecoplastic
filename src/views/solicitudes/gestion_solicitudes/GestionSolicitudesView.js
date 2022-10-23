import React, { useState } from "react";
import { Grid } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import ShowSolicitudes from "../ShowSolicitudes";
import Page from "../../../components/Page";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
  },
}));

const GestionSolicitudesView = () => {
  const classes = useStyles();

  const [title, setTitle] = useState("Gestion de solicitudes");

  return (
    <Grid item xs={12}>
      <Page className={classes.root} title={title}>
        <ShowSolicitudes type="admin" setTitle={setTitle} />
      </Page>
    </Grid>
  );
};

export default GestionSolicitudesView;
