import React from "react";

import { Dialog, Typography, Button } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import CloseIcon from "@mui/icons-material/Close";

const useStyles = makeStyles((theme) => ({
  paperDialog: {
    height: "100%",
    width: "100%",
    maxWidth: "100%",
    [theme.breakpoints.down("md")]: {
      margin: 0,
      maxHeight: "100%",
    },
  },
  mainContainerViewer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  contentViewer: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  imageStyle: {
    objectFit: "contain",
    maxWidth: "80%",
  },
  footerViewer: {
    width: "100%",
    borderTop: `1px solid ${theme.palette.divider}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 15px",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      "& > button": {
        marginTop: "15px",
        width: "100%",
      },
    },
  },
}));

const DialogViewer = ({ openViewer, handleCloseViewer, viewerOptions }) => {
  const classes = useStyles();

  return (
    <Dialog
      onClose={handleCloseViewer}
      open={openViewer}
      fullWidth
      classes={{ paper: classes.paperDialog }}
    >
      <div className={classes.mainContainerViewer}>
        <div className={classes.contentViewer}>
          {viewerOptions.type === "image" && (
            <img
              alt={viewerOptions.title}
              src={viewerOptions.url}
              className={classes.imageStyle}
            />
          )}

          {viewerOptions.type === "pdf" && (
            <div style={{ width: "100%", height: "100%" }}>
              <iframe
                src={viewerOptions.url}
                width="100%"
                height="100%"
              ></iframe>
            </div>
          )}
        </div>

        <div className={classes.footerViewer}>
          <div>
            <Typography variant="caption">Nombre del archivo:</Typography>
            <Typography>{viewerOptions.title}</Typography>
          </div>

          <Button
            variant="contained"
            color="primary"
            startIcon={<CloseIcon />}
            onClick={handleCloseViewer}
          >
            Cerrar
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default DialogViewer;
