import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import { Grid, Container } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

import dayjs from "dayjs";
import es from "dayjs/locale/es";

import AdministradorDeContenidos from "./AdministradorDeContenidos";
import Page from "../../../components/Page";
import { getUserToken } from "../../../helpers/setGetToken";
import { fetchRequest, setRequestToken } from "../../../helpers/fetchRequest";
import PostCardList from "../../product/PostCardList";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const PublicacionesView = () => {
  const classes = useStyles();

  const [publications, setPublication] = useState([]);
  const [filtersAndParams, setFiltersAndParams] = useState(initialFilterValues);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [loadingData, setLoadingData] = useState(false);
  const [totalPublications, setTotalPublications] = useState(0);
  const [error, setError] = useState(null);
  const {
    user: { usuario },
  } = useSelector((state) => state.auth);

  const getPublications = async () => {
    setLoadingData(true);

    try {
      const token = getUserToken();

      setRequestToken(token);
      const response = await fetchRequest(
        `/producto/get_mis_publicacione/${usuario.idUsuario}?page=${page}&limit=${rowsPerPage}&showAll=1`,
        "POST",
        filtersAndParams
      );

      const { rows, total } = response.data.data;

      const dataFormated = rows.map((publicacion) => ({
        id: publicacion.idproductos,
        publicationTitle: publicacion.titulo,
        publishSwitch: publicacion.isocultar,
        iscommint: publicacion.comments,
        date: dayjs(publicacion.createdate)
          .locale(es)
          .format("DD [de] MMMM [de] YYYY"),
        rating: publicacion.rating,
        comments: publicacion.comentarios,
        publicedBy: publicacion.nombre,
        avatar: publicacion.userImage,
        idCreador: publicacion.usuario_idusers,
        publicationType: publicacion.categoria,
      }));

      setPublication(dataFormated);
      setTotalPublications(total);
    } catch (error) {
      console.log(error);
      let msg = error.response?.data.errores
        ? typeof error.response.data.errores === "string"
          ? error.response.data.errores
          : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde"
        : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde";

      setError(msg);
    } finally {
      setLoadingData(false);
    }
  };

  //ADD PUBLICATION
  const addPublication = (publication) => {
    setPublication([publication, ...publications]);
  };

  //CONTROLADOR DE FORMULARIO
  const [formSettings, setFormSettings] = useState({
    open: false,
    data: {},
    type: "new",
  });

  useEffect(() => {
    getPublications();
  }, [page, rowsPerPage, filtersAndParams]);

  //   useEffect(() => {
  //     window.scrollTo({
  //       top: 0,
  //       behavior: "smooth",
  //     });
  //   }, [page]);

  return (
    <>
      <Page title="Administrador de contenidos" className={classes.root}>
        <Container maxWidth={false}>
          <Grid item xs={12}>
            <AdministradorDeContenidos
              setPublication={setPublication}
              addPublication={addPublication}
              formSettings={formSettings}
              updateFormSettings={setFormSettings}
              getPublications={getPublications}
            />
          </Grid>

          <Grid item xs={12}>
            <PostCardList
              setPage={setPage}
              publications={publications}
              totalPublications={totalPublications}
              updateFormSettings={setFormSettings}
              filtersAndParams={filtersAndParams}
              setFiltersAndParams={setFiltersAndParams}
            />
          </Grid>
        </Container>
      </Page>
    </>
  );
};

const initialFilterValues = {
  etiquetas: [],
  tituloPublicacion: "",
  fechaPublicacion: null,
  estadoPublicacion: null,
  tipoPublicacion: null,
};

export default PublicacionesView;
