import * as React from "react";

import { IconButton, Typography } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import CloseIcon from "@mui/icons-material/Close";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "60px",
    padding: "15px 10px",
    display: "flex",
    alignItems: "center",
    borderBottom: `1px solid ${theme.palette.divider}`,
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 2,
    width: "100%",
    backgroundColor: theme.palette.background.default,
    boxShadow: "0px 3px 8px -5px rgb(0 0 0 / 52%)",
  },
}));

const AppbarDialogFullScreen = ({ title, onClose, children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <IconButton
        style={{ marginRight: 15 }}
        onClick={onClose}
        color="inherit"
        size="large"
      >
        <CloseIcon />
      </IconButton>

      <Typography variant="h4">{title}</Typography>

      {children}
    </div>
  );
};

export default AppbarDialogFullScreen;
