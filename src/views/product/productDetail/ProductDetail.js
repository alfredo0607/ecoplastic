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
import Page from "../../../components/Page";
import InformationDetail from "./InformationDetail";
import { fetchRequest, setRequestToken } from "../../../helpers/fetchRequest";
import { getUserToken } from "../../../helpers/setGetToken";

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
  const [recomendation, setRecomendation] = useState([]);
  const [editorState, setEditorState] = useState({});
  const [customAlert, setCustomAlert] = useState({
    type: null,
    message: null,
  });
  const [loading, setLoading] = useState(false);

  const handleCloseAlert = () => setCustomAlert({ type: null, message: null });

  const getPublication = async () => {
    setLoading(true);
    const token = getUserToken();
    try {
      setRequestToken(token);
      const response = await fetchRequest(
        `/publicaciones/obtener_detalle_publicacion/${id}/${usuario.idUsuario}`,
        "GET",
        {}
      );

      const { row } = response.data.data;

      const publicationStateFormated =
        row.adminData.estado === 0 ? "No publicado" : "Publicado";

      const dataFormated = {
        id: row.id,
        publicationTitle: row.titulo,
        publicationContain: row.contenido,
        date: dayjs(row.fechaCreacion)
          .locale(es)
          .format("DD [de] MMMM [de] YYYY"),
        activeCommentaries: row.comentariosActivos,
        cover: row.cover,
        featuredContent: row.esDestacado,
        publicationType: row.tipoPublicacion,
        colorType: row.colorTipo,
        publicedBy: row.nombreCreador,
        avatar: row.imagenCreador,
        idCreador: row.idCreador,
        tags: row.tags,
        video: row.videos,
        files: row.archivos,
        voteUser: row.votoUsuario,
        publicationState: publicationStateFormated,
        userConfirm: row.firmaUsuario,
        idDataAdmin: row.adminData.id,
        adminDataDate: row.adminData.fechaCreacion,
        adminDataLastModification: dayjs(row.adminData.ultimaActualizacion)
          .locale(es)
          .format("DD [de] MMMM [de] YYYY"),
        adminDataRating: row.adminData.rating,
        adminDataComments: row.adminData.totalComentarios,
      };

      setPublication(dataFormated);

      const formatedRecomendations = row.recomendadas.map((row) => ({
        id: row.id,
        date: dayjs(row.fechaCreacion)
          .locale(es)
          .format("DD [de] MMMM [de] YYYY"),
        colorType: row.colorTipo,
        publicationType: row.tipoPublicacion,
        cover: row.cover,
        publicationTitle: row.tituloPublicacion,
      }));

      setRecomendation(formatedRecomendations);

      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(dataFormated.publicationContain)
        )
      );

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

  // if (Object.keys(publication).length === 0) {
  //   return (
  //     <>
  //       <div>Loading...</div>
  //     </>
  //   );
  // }

  const dataFormated = [
    {
      id: 1,
      publicationTitle: "Titulo",
      publicationContain: "contenido bb",
      date: dayjs("2022/01/01").locale(es).format("DD [de] MMMM [de] YYYY"),
      activeCommentaries: true,
      cover: "",
      featuredContent: true,
      publicationType: "",
      colorType: "",
      publicedBy: "Alfredo Dominguez",
      avatar: "",
      idCreador: 1,
      tags: "",
      video: "",
      files: "",
      voteUser: "",
      publicationState: "",
      userConfirm: "",
      idDataAdmin: "",
      adminDataDate: "",
      adminDataLastModification: dayjs("2022/01/01")
        .locale(es)
        .format("DD [de] MMMM [de] YYYY"),
      adminDataRating: 1,
      adminDataComments: 1,
    },
  ];

  // setEditorState(
  //   EditorState.createWithContent(
  //     convertFromRaw("hola como estas")
  //   )
  // );

  // console.log(editorState);

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
            publicacion={dataFormated}
            recomendation={recomendation}
            editorState={editorState}
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
