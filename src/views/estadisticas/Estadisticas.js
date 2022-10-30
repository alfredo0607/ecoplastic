import React, { useEffect, useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import Page from "../../components/Page";
import TotalCustomers from "../../components/estadisticas/TotalCustomers";
import Budget from "../../components/estadisticas/Budget";
import TasksProgress from "../../components/estadisticas/TasksProgress";
import LatestProducts from "../../components/estadisticas/LatestProducts";
import LatestOrders from "../../components/estadisticas/LatestOrders";
import TotalProfit from "../../components/estadisticas/TotalProfit";
import { getUserToken } from "../../helpers/setGetToken";
import { fetchRequest, setRequestToken } from "../../helpers/fetchRequest";
import { useSelector } from "react-redux";
import LoadingForms from "../../components/LoadingForms";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const Estadisticas = ({ type = "user" }) => {
  const classes = useStyles();

  const {
    user: { usuario },
  } = useSelector((state) => state.auth);

  const [estadisticas, setestadisticas] = useState({});
  const [loading, setloading] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);

  const [messageResponse, setMessageResponse] = useState(null);
  const [publication, setPublication] = useState([]);

  const getEstadisticas = async () => {
    try {
      setloading(true);

      const token = getUserToken();
      setRequestToken(token);

      const idParams =
        type === "admin" ? usuario?.empresa?.idempresa : usuario?.idUsuario;

      const {
        data: { data },
      } = await fetchRequest(
        `/estadisticas/get_estadisticas/${idParams}?type=${type}`,
        "GET"
      );

      console.log(data);

      setestadisticas(data);
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  const getSolicitudesUser = async (page = 0, limit = 10, filters = null) => {
    try {
      const token = getUserToken();
      setRequestToken(token);

      const ruta =
        type === "user" ? "get_mis_solicitud_productos" : "get_admin_solicitud";

      const idParams =
        type === "admin" ? usuario?.empresa?.idempresa : usuario?.idUsuario;

      const {
        data: { data },
      } = await fetchRequest(`/solicitudes/${ruta}/${idParams}`, "GET");

      setSolicitudes(data.request);
    } catch (error) {
      console.log(error);
    }
  };

  const getPublications = async () => {
    try {
      const token = getUserToken();

      const ruta =
        type === "admin"
          ? `/producto/get_publicacione_admin/${usuario.idUsuario}/${
              usuario.empresa.idempresa
            }?page=${0}&limit=${7}&showAll=1`
          : `/producto/get_mis_publicacione/${
              usuario.idUsuario
            }?page=${0}&limit=${7}&showAll=1`;

      const typePethi = type === "admin" ? "GET" : "POST";

      setRequestToken(token);
      const response = await fetchRequest(ruta, typePethi);

      const { rows } = response.data.data;

      const dataFormated = rows.map((publicacion) => ({
        id: publicacion.idproductos,
        publicationTitle: publicacion.titulo,
        cover: publicacion.cover,
        create: publicacion.createdate,
      }));

      setPublication(dataFormated);
    } catch (error) {
      console.log(error);
      let msg = error.response?.data.errores
        ? typeof error.response.data.errores === "string"
          ? error.response.data.errores
          : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde"
        : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde";

      setMessageResponse({ type: "error", message: msg });
    }
  };

  useEffect(() => {
    getEstadisticas();
    getSolicitudesUser();
    getPublications();
  }, []);

  return (
    <Page className={classes.root} title="Estadisticas">
      {loading && <Typography>Cargando...</Typography>}

      {!loading && (
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <Budget estadisticas={estadisticas} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalCustomers estadisticas={estadisticas} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TasksProgress estadisticas={estadisticas} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalProfit estadisticas={estadisticas} />
            </Grid>
            <Grid item lg={8} md={12} xl={9} xs={12}>
              {/* <Sales estadisticas={estadisticas} /> */}
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              {/* <TrafficByDevice estadisticas={estadisticas} /> */}
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              {publication.length !== 0 && (
                <LatestProducts publication={publication} />
              )}
            </Grid>
            <Grid item lg={8} md={12} xl={9} xs={12}>
              {solicitudes.length !== 0 && (
                <LatestOrders solicitudes={solicitudes} />
              )}
            </Grid>
          </Grid>
        </Container>
      )}
    </Page>
  );
};

export default Estadisticas;
