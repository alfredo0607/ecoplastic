import React from "react";
import { Typography } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  titleContainer: {
    display: "inline-block",
    borderRadius: "15px",
    padding: "5px",
    paddingRight: "8px",
    paddingLeft: "8px",
    backgroundColor:
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.8)"
        : "rgba(255, 255, 255, 0.9)",
    marginBottom: "10px",
    color:
      theme.palette.mode !== "light"
        ? "rgba(0, 0, 0, 0.8)"
        : "rgba(255, 255, 255, 0.9)",
  },
  title: {
    display: "flex",
    alignItems: "center",
  },
}));

const TitleForm = ({ title, icon: IconTitle }) => {
  const classes = useStyles();

  return (
    <div className={classes.titleContainer}>
      <Typography variant="h4" className={classes.title}>
        {title}
        {IconTitle && <IconTitle style={{ marginLeft: "5px" }} />}
      </Typography>
    </div>
  );
};

export default TitleForm;
