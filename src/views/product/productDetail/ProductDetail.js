/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { convertToRaw, convertFromRaw, EditorState } from "draft-js";
import {
  Grid,
  Paper,
  Box,
  Button,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import es from "date-fns/locale/es";
import InformationDetail from "./InformationDetail";
import { fetchRequest, setRequestToken } from "../../../helpers/fetchRequest";
import { getUserToken } from "../../../helpers/setGetToken";
import Page from "../../../components/Page";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  titleText: {
    color:
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.7)"
        : "rgba(255, 255, 255, 0.9)",
  },
  title: {
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  },
}));

const ProductDetail = () => {
  const classes = useStyles();

  const {
    user: { usuario },
  } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { id } = useParams();

  const [publication, setPublication] = useState({});
  const [editorState, setEditorState] = useState({});
  const [rating, setrating] = useState(0);
  const [customAlert, setCustomAlert] = useState({
    type: null,
    message: null,
  });
  const [loading, setLoading] = useState(false);
  const [comentarios, setcomentarios] = useState([]);
  const [imagenes, setimagenes] = useState([]);

  const handleCloseAlert = () => setCustomAlert({ type: null, message: null });

  const getPublication = async () => {
    setLoading(true);
    const token = getUserToken();
    try {
      setRequestToken(token);
      const response = await fetchRequest(
        `/producto/get__publicacion_detail/${usuario.idUsuario}/${id}`,
        "GET"
      );

      const {
        responseProduct,
        responseImg,
        comentarios,
        totalComentarios,
        rating,
      } = response.data.data;

      const publicationStateFormated =
        responseProduct.isocultar === 1 ? "No publicado" : "Publicado";

      const dataFormated = {
        id: responseProduct.idproductos,
        publicationTitle: responseProduct.titulo,
        publicationContain: responseProduct.descripcion,
        date: dayjs(responseProduct.createdate)
          .locale(es)
          .format("DD [de] MMMM [de] YYYY"),
        activeCommentaries: responseProduct.comments,
        cover: responseProduct.cover,
        publicationType: responseProduct.categoria,
        publicedBy: responseProduct.nombre,
        avatar: responseProduct.userImage,
        idCreador: responseProduct.idusers,
        publicationState: publicationStateFormated,
        adminDataRating: rating,
        adminDataComments: totalComentarios,
      };

      setrating(rating);
      setPublication(dataFormated);
      setcomentarios(comentarios);
      setimagenes(responseImg);

      setLoading(false);
    } catch (error) {
      console.log(error);
      let msg = error.response?.data.errores
        ? typeof error.response.data.errores === "string"
          ? error.response.data.errores
          : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde"
        : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde";

      setCustomAlert({ type: "error", message: msg });
      setLoading(false);
    }
  };

  useEffect(() => {
    getPublication();
  }, []);

  if (loading && Object.keys(publication).length === 0) {
    return (
      <>
        <div>Loading...</div>
      </>
    );
  }

  return (
    <Page className={classes.root} title="Detalles publicacion">
      <Grid container justifyContent="center">
        <Grid item xs={12} md={11}>
          <Paper>
            <Box
              p={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              className={classes.title}
            >
              <Button
                color="primary"
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
              >
                Volver atras
              </Button>
            </Box>
          </Paper>

          <InformationDetail
            comentarios={comentarios}
            imagenes={imagenes}
            rating={rating}
            setrating={setrating}
            publicacion={publication}
            editorState={editorState}
            setcomentarios={setcomentarios}
          />
        </Grid>
      </Grid>

      <Snackbar
        open={!!customAlert.type}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
      >
        <Alert
          severity={customAlert.type || "info"}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleCloseAlert}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {customAlert.message}
        </Alert>
      </Snackbar>
    </Page>
  );
};

export default ProductDetail;
