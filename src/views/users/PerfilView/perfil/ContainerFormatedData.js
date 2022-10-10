import * as React from "react";

import { Typography, Box, Divider } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  containerForm: {
    position: "relative",
  },
  overlayFormatedData: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    borderRadius: 5,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3),
    display: "none",
  },
  text: {
    marginBottom: theme.spacing(0.3),
    color:
      theme.palette.mode === "light"
        ? theme.palette.grey[700]
        : theme.palette.grey[400],
    paddingLeft: theme.spacing(1),
  },
  textTitle: {
    fontSize: theme.spacing(2.1),
    fontWeight: 500,
  },
  contentBox: {
    width: "100%",
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
}));

const ContainerFormatedData = ({ children, title, data, open }) => {
  const classes = useStyles();

  return (
    <div className={classes.containerForm}>
      <div
        className={classes.overlayFormatedData}
        style={{ display: open ? "block" : "none" }}
      >
        <Box mb={2}>
          <Typography variant="h4" color="textPrimary">
            Modo Lectura: {title}
          </Typography>
        </Box>

        <Box mb={2}>
          <Divider />
        </Box>

        <div className={classes.containerText}>
          {Object.keys(data || {}).map((key, index) => (
            <div key={String(index)} className={classes.contentBox}>
              <Typography variant="subtitle1" className={classes.textTitle}>
                {key}:
                <Typography
                  variant="body1"
                  display="inline"
                  className={classes.text}
                >
                  {data[key]}
                </Typography>
              </Typography>
            </div>
          ))}
        </div>
      </div>

      {children}
    </div>
  );
};

export default ContainerFormatedData;
