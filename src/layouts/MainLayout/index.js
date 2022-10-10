import React from "react";
import { Outlet } from "react-router-dom";
import { Grid, Box } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
    padding: theme.spacing(2),
    background: theme.palette.background.default,
    backgroundImage: "url(/static/images/main-background.jpg)",
    backgroundRepeat: "repeat",
  },
  mainContent: {
    background: theme.palette.background.paper,
    borderRadius: "5px",
    width: "100%",
    height: "100%",
    boxShadow: "2px 2px 7px 1px #0000009e",
  },
  content: {
    width: "100%",
    height: "100%",
    padding: theme.spacing(1, 2),
    overflowY: "auto",
    position: "relative",
    "&::-webkit-scrollbar": {
      width: "17px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#d6dee1",
      borderRadius: "20px",
      border: "6px solid transparent",
      backgroundClip: "content-box",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#a8bbbf",
    },
  },
  image: {
    backgroundImage: "url(/static/images/auth-background.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
  },
  logo: {
    height: "40px",
    width: "40px",
    borderRadius: "100%",
  },
}));

const MainLayout = () => {
  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <Grid xs={false} sm={false} md={1} item />{" "}
      {/* Grid for spacing of main content */}
      <Grid
        xs={12}
        sm={12}
        md={10}
        container
        item
        component="div"
        className={classes.mainContent}
      >
        <Grid item xs={12} sm={12} md={6} lg={5} className={classes.content}>
          <Box mb={3} ml={2} mt={2}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/600px-Facebook_f_logo_%282019%29.svg.png"
              alt="Logo de EcoPlastic"
              className={classes.logo}
            />
          </Box>

          <Outlet />
        </Grid>

        <Grid
          item
          xs={false}
          sm={false}
          md={6}
          lg={7}
          className={classes.image}
        />
      </Grid>
      <Grid xs={false} sm={false} md={1} item />{" "}
      {/* Grid for spacing of main content */}
    </Grid>
  );
};

export default MainLayout;
