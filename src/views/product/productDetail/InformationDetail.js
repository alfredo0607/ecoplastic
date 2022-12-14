import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";

import {
  Grid,
  Typography,
  Paper,
  Snackbar,
  IconButton,
  Alert,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";
import DetailPublication from "./DetailPublication";
import DeatilPublicationData from "./DeatilPublicationData";
import { fetchRequest, setRequestToken } from "../../../helpers/fetchRequest";
import { getUserToken } from "../../../helpers/setGetToken";

const useStyles = makeStyles((theme) => ({
  card: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
}));

const InformationDetail = ({
  publicacion,
  editorState,
  rating,
  imagenes,
  comentarios,
  setcomentarios,
  setrating,
}) => {
  const classes = useStyles();
  const {
    user: { usuario },
  } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [visibleRating, setVisibleRating] = useState(true);
  const [customAlert, setCustomAlert] = useState({
    type: null,
    message: null,
  });
  const [openDialogComent, setOpenDialogComent] = useState(false);
  const [openDialogFirm, setOpenDialogFirm] = useState(false);
  const sigCanvas = useRef({});

  const handleOpen = () => setOpenDialogFirm(true);
  const handleClose = () => setOpenDialogFirm(false);
  const handleOpenNewComment = () => setOpenDialogComent(true);
  const handleCloseNewComment = () => setOpenDialogComent(false);

  const handleCloseError = () => setCustomAlert({ type: null, message: null });

  const handleRating = async (newRating) => {
    const token = getUserToken();
    try {
      setRequestToken(token);
      await fetchRequest(
        `/publicaciones/agregar_rating_publicacion/${publicacion.id}`,
        "PUT",
        {
          idUsuario: usuario.idUsuario,
          rating: rating,
        }
      );

      setCustomAlert({
        type: "success",
        message:
          "Se ha confirmado tu participacion en este evento, muchas gracias.",
      });

      setVisibleRating(false);
    } catch (error) {
      let msg = error.response?.data.errores
        ? typeof error.response.data.errores === "string"
          ? error.response.data.errores
          : "Ocurrio un error inesperado, por favor intentalo de nuevo m??s tarde"
        : "Ocurrio un error inesperado, por favor intentalo de nuevo m??s tarde";

      setCustomAlert({ type: "error", message: msg });
      console.log(error);
    }
  };

  return (
    <Paper style={{ marginTop: 30 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} textAlign="center">
          <Typography variant="h2" color="textPrimary">
            {publicacion.publicationTitle}
          </Typography>
        </Grid>
        <Grid container item>
          <Grid item xs={12} sm={9} p={2}>
            <div className={classes.card}>
              <DetailPublication
                comentarios={comentarios}
                publicacion={publicacion}
                editorState={editorState}
                imagenes={imagenes}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={3} p={2}>
            <div className={classes.card}>
              <DeatilPublicationData
                comentarios={comentarios}
                setcomentarios={setcomentarios}
                publicacion={publicacion}
                sigCanvas={sigCanvas}
                open={openDialogFirm}
                handleOpen={handleOpen}
                handleClose={handleClose}
                openDialogComent={openDialogComent}
                handleOpenNewComment={handleOpenNewComment}
                handleCloseNewComment={handleCloseNewComment}
                rating={rating}
                setrating={setrating}
                handleRating={handleRating}
                visibleRating={visibleRating}
                setCustomAlert={setCustomAlert}
              />
            </div>
          </Grid>
        </Grid>
      </Grid>

      <Snackbar
        open={!!customAlert.type}
        autoHideDuration={3000}
        onClose={handleCloseError}
      >
        <Alert
          severity={customAlert.type || "info"}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleCloseError}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {customAlert.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default InformationDetail;
