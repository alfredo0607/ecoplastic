import React, { useState, useEffect, useRef, forwardRef } from "react";

import {
  Stack,
  Typography,
  Box,
  Rating,
  Divider,
  Button,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
} from "@mui/material";
import makeStyles from "@material-ui/styles/makeStyles";

import AddCommentIcon from "@mui/icons-material/AddComment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

const useStyles = makeStyles((theme) => ({
  card: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #5a5a5a",
    padding: 10,
    textAlign: "center",
    borderRadius: 5,
  },
}));

const labels = {
  2.5: "Ok",
  3: "Ok+",
  3.5: "Bueno",
  4: "Bueno+",
  4.5: "Excelente",
  5: "Excelente+",
};

const getLabelText = (value) =>
  `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeatilPublicationData = ({
  publicacion,
  sigCanvas,
  open,
  handleOpen,
  handleClose,
  openDialogComent,
  handleOpenNewComment,
  handleCloseNewComment,
  handleSendComment,
  rating,
  handleRating,
  visibleRating,
  recomendation,
}) => {
  const classes = useStyles();

  return (
    <>
      <Stack spacing={2}>
        <Box className={classes.card}>
          {publicacion.voteUser === 1 ? (
            <Typography component="legend" pb={1}>
              🎉 Gracias por puntuar esta publicacion!
            </Typography>
          ) : visibleRating ? (
            <>
              <Typography component="legend" pb={1}>
                ¿Te ha gustado esta publicación?
              </Typography>
              <Divider variant="middle" />
              <Rating
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: 7,
                }}
                name="calification"
                value={rating}
                onChange={(event, newRating) => handleRating(newRating)}
                precision={0.5}
                size="large"
                max={5}
                getLabelText={getLabelText}
              />
            </>
          ) : (
            <Typography component="legend" pb={1}>
              🎉 Gracias por puntuar esta publicacion!
            </Typography>
          )}
        </Box>

        <Box className={classes.card}>
          <Typography variant="h3" color="textPrimary" pb={1}>
            Comentarios
          </Typography>
          <Divider variant="middle" />
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 1 }}
            onClick={handleOpenNewComment}
          >
            <AddCommentIcon sx={{ marginRight: 1 }} /> Agregar comentario
          </Button>
        </Box>

        <Box className={classes.card}>
          <Typography variant="h3" color="textPrimary" pb={1}>
            Solicitud de intercambio
          </Typography>
          <Divider variant="middle" />
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 1 }}
            onClick={handleOpenNewComment}
          >
            <AddCommentIcon sx={{ marginRight: 1 }} /> Enviar solicitud
          </Button>
        </Box>
        <Box className={classes.card}>
          <Typography variant="h4" color="textPrimary" pb={1}>
            Tal vez te interese
          </Typography>
          <Divider variant="middle" />
          <Typography variant="h6" color="textPrimary" sx={{ marginTop: 1 }}>
            MiniCard con publicaciones
          </Typography>
        </Box>
      </Stack>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Firma sobre la almohadilla y confirma tu participacion"}
        </DialogTitle>
        <DialogContent>HOLA MUNDO</DialogContent>
      </Dialog>

      <Dialog
        open={openDialogComent}
        onClose={handleCloseNewComment}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle sx={{ fontSize: "1.2em" }}>Nuevo comentario</DialogTitle>
        <DialogContent>
          <DialogContentText marginBottom={1}>
            Escribe un comentario acerca de tu opinión sobre la publicación, que
            te gusto y que no te gusto.
          </DialogContentText>
          <TextField
            //inputRef={inputChatRef}
            type="text"
            variant="outlined"
            fullWidth
            label="Comentar."
            multiline
            rows={2}
            rowsMax={3}
            placeholder="Escribe tu comentario..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewComment} color="primary">
            Cancela
          </Button>
          <Button onClick={handleSendComment} color="primary">
            Publicar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeatilPublicationData;
