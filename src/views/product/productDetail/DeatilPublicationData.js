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
import * as yup from "yup";
import makeStyles from "@material-ui/styles/makeStyles";

import AddCommentIcon from "@mui/icons-material/AddComment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { fetchRequest, setRequestToken } from "../../../helpers/fetchRequest";
import { getUserToken } from "../../../helpers/setGetToken";
import { useSelector } from "react-redux";

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

const schema = yup.object().shape({
  comentario: yup.string().required("El comentario es requerida"),
});

const DeatilPublicationData = ({
  open,
  handleOpen,
  handleClose,
  openDialogComent,
  handleOpenNewComment,
  handleCloseNewComment,
  handleSendComment,
  rating,
  handleRating,
  publicacion,
  setcomentarios,
  comentarios,
  setCustomAlert,
  setrating,
}) => {
  const classes = useStyles();

  const defaultValues = {
    comentario: "",
  };

  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const [ratingU, setratingU] = useState(0);

  const {
    user: { usuario },
  } = useSelector((state) => state.auth);

  const newComentario = async (data) => {
    try {
      const newComentario = {
        comentario: data.comentario,
        calificacion: ratingU,
      };

      const token = getUserToken();
      setRequestToken(token);

      const response = await fetchRequest(
        `/producto/comentar_publicacion/${usuario?.idUsuario}/${publicacion.id}`,
        "POST",
        {
          ...newComentario,
        }
      );

      const { coment, promedio } = response.data.data;

      setcomentarios([coment, ...comentarios]);
      setrating(promedio);

      handleCloseNewComment();

      setCustomAlert({
        type: "success",
        message:
          "Se ha confirmado tu participacion en este evento, muchas gracias.",
      });
    } catch (error) {
      let msg = error.response?.data.errores
        ? typeof error.response.data.errores === "string"
          ? error.response.data.errores
          : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde"
        : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde";

      setCustomAlert({ type: "error", message: msg });
      console.log(error);
    }
  };

  return (
    <>
      <Stack spacing={2}>
        <Box className={classes.card}>
          <>
            <Typography component="legend" pb={1}>
              Calificacion de la publicacion
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
          <Typography variant="h3" color="textPrimary" pb={1}>
            Comentarios
          </Typography>
          <Divider variant="middle" />
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 1 }}
            disabled={publicacion.activeCommentaries === 0 ? 1 : 0}
            onClick={handleOpenNewComment}
          >
            <AddCommentIcon sx={{ marginRight: 1 }} /> Agregar comentario
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
        <form onSubmit={handleSubmit(newComentario)}>
          <DialogTitle sx={{ fontSize: "1.2em" }}>Nuevo comentario</DialogTitle>
          <DialogContent>
            <DialogContentText marginBottom={1}>
              Escribe un comentario acerca de tu opinión sobre la publicación,
              que te gusto y que no te gusto.
            </DialogContentText>

            <Box className={classes.card}>
              <>
                <Typography component="legend" pb={1}>
                  ¿Califica este producto?
                </Typography>
                <Divider variant="middle" />
                <Rating
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: 7,
                  }}
                  name="calification"
                  value={ratingU}
                  onChange={(event, newRating) => setratingU(newRating)}
                  precision={0.5}
                  size="large"
                  max={5}
                  getLabelText={getLabelText}
                />
              </>
            </Box>
            <TextField
              //inputRef={inputChatRef}
              type="text"
              variant="outlined"
              fullWidth
              label="Comentar."
              name="comentario"
              multiline
              rows={2}
              rowsMax={3}
              placeholder="Escribe tu comentario..."
              error={!!errors.comentario}
              inputRef={register({ required: "Este campo es requerido" })}
              helperText={errors.comentario ? errors.comentario.message : ""}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNewComment} color="primary">
              Cancela
            </Button>
            <Button type="submit" onClick={handleSendComment} color="primary">
              Publicar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default DeatilPublicationData;
