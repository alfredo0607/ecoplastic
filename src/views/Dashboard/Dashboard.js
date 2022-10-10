import React, { Fragment } from "react";
import { Container, Grid } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import Page from "../../components/Page";
import Carrusel from "./publicaciones/Carrusel";
import PublicationsCard from "./publicaciones/PublicationsCard";
import Card from "@mui/material/Card";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    // paddingTop: theme.spacing(1),
  },

  color1: {
    backgroundColor: "red",
  },
  color2: {
    backgroundColor: "green",
  },
  color3: {
    backgroundColor: "red",
  },
  color4: {
    backgroundColor: "yellow",
    margin: "0px auto",
  },
}));

export default function Dashboard() {
  const classes = useStyles();

  return (
    // <Page title="Dashboard">
    <Container className={classes.color4} maxWidth={true}>
      <Grid container spacing={3}>
        <Grid className={classes.color1} xs>
          <Card className={classes.color4} sx={{ maxWidth: 345 }}>
            <h1>xs</h1>
          </Card>
        </Grid>
        <Grid className={classes.color2} xs={6}>
          <Card className={classes.color4} sx={{ maxWidth: 345 }}>
            <h1>xs</h1>
          </Card>
        </Grid>
        <Grid className={classes.color3} xs>
          <Card sx={{ maxWidth: 345 }}>
            <h1>xs</h1>
          </Card>
        </Grid>
      </Grid>

      {/* <Grid container spacing={1}>
          <Grid item lg={12} md={12} xl={9} xs={12}>
            <Carrusel />
          </Grid>
        </Grid> */}
    </Container>
    // </Page>
  );
}

{
  /* <Carrusel />

      <Grid
        className={classes.cont}
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {Array.from(Array(6)).map((_, index) => (
          <Grid item xs={2} sm={4} md={4} key={index}>
            <PublicationsCard />
          </Grid>
        ))}
      </Grid> */
}
