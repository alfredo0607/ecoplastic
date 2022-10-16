/* eslint-disable jsx-a11y/img-redundant-alt */
import * as React from "react";

import { Typography, IconButton, Box } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import CloseIcon from "@mui/icons-material/Close";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    width: "100%",
    height: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
    zIndex: 10000,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255, 255, 255, 0.7)",
  },
  image: {
    maxWidth: "80%",
    objectFit: "contain",
  },
  buttonClose: {
    position: "absolute",
    top: 40,
    right: 40,
    color: "#fff",
  },
  caption: {
    backgroundColor: "#000",
    padding: theme.spacing(0, 1),
  },
}));

const ImageBackdrop = ({
  src,
  open,
  onClose,
  caption = null,
  classBackgroundImage = null,
}) => {
  const classes = useStyles();

  const handleCloseBackdrop = (e) => {
    const type = e.type;

    if (type === "click") {
      if (e.target.localName === "img" || e.target.localName === "h6") return;
      onClose();
    }

    if (type === "keyup") {
      const isEscape =
        e.key === "Escape" || e.key === "Esc" || e.keyCode === 27;

      if (isEscape) {
        onClose();
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className={classes.backdrop}
      onKeyUp={handleCloseBackdrop}
      onClick={handleCloseBackdrop}
      tabIndex="0"
    >
      <Box
        className={clsx({
          [classBackgroundImage]: classBackgroundImage,
        })}
      >
        <img
          src={src}
          alt="Image Loaded by an user"
          className={classes.image}
        />
      </Box>
      {caption && (
        <Box mt={1} className={classes.caption}>
          <Typography color="inherit" variant="subtitle1">
            {caption}
          </Typography>
        </Box>
      )}
      <IconButton color="primary" className={classes.buttonClose} size="large">
        <CloseIcon color="inherit" />
      </IconButton>
    </div>
  );
};

export default ImageBackdrop;
