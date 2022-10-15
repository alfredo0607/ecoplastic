import * as React from "react";

import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { Skeleton } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "5px",
    overflow: "hidden",
    width: "100%",
    position: "relative",
    marginBottom: "10px",
    height: "153px",
    transition: "all .3s ease",
    "&:nth-child(3n)": {
      marginRight: "0 !important",
    },
  },
  thumnail: {
    backgroundColor:
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.03)"
        : "rgba(255, 255, 255, 0.02)",
    height: "100px",
    minHeight: "100px",
    width: "100%",
    color:
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.1)"
        : "rgba(255, 255, 255, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "5px",
  },
  icon: {
    width: theme.spacing(4.5),
    height: theme.spacing(4),
    marginTop: 2,
  },
}));

const FileCardSkeleton = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.thumnail}>
        <Typography variant="h2" color="inherit">
          LOADING
        </Typography>
      </div>
      <div className={classes.content}>
        <Skeleton
          variant="circular"
          animation="wave"
          className={classes.icon}
        />

        <div style={{ overflow: "hidden", marginLeft: 5, width: "100%" }}>
          <Typography variant="body2">
            <Skeleton animation="wave" variant="text" width="100%" />
          </Typography>
          <Typography variant="caption">
            <Skeleton animation="wave" variant="text" width="50%" />
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default FileCardSkeleton;
