/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Snackbar,
  Alert,
  IconButton,
  Card,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Pagination, Skeleton } from "@mui/material";
import Page from "../../../components/Page";
import ProductCard from "./ProductCard";
import data from "./data";
import Carrusel from "../../Dashboard/publicaciones/Carrusel";
import { getUserToken } from "../../../helpers/setGetToken";
import { fetchRequest, setRequestToken } from "../../../helpers/fetchRequest";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
  },
  productCard: {
    height: "100%",
  },
}));

const ProductList = () => {
  const classes = useStyles();

  const array = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ];

  const [loading, setLoading] = useState(false);
  const [publicacion, setPublicacion] = useState([]);
  const [customAlert, setCustomAlert] = useState({ type: "", message: "" });

  const {
    user: { usuario },
  } = useSelector((state) => state.auth);

  const getPublication = async () => {
    setLoading(true);
    const token = getUserToken();
    try {
      setRequestToken(token);
      const res = await fetchRequest(
        `/producto/get_publicacione/${usuario.idUsuario}`,
        "GET"
      );

      const { response } = res.data.data;

      setPublicacion(response);

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

  const handleCloseError = () => {
    setCustomAlert({ type: "", message: "" });
  };

  useEffect(() => {
    getPublication();
  }, []);

  return (
    <Page className={classes.root} title="Products">
      <Container maxWidth={false}>
        {loading && <Skeleton variant="rounded" width={"100%"} height={300} />}

        {!loading && <Carrusel />}

        <Box mt={3}>
          <Grid container spacing={3}>
            {!loading &&
              publicacion.length !== 0 &&
              publicacion.map((product) => (
                <Grid item key={product.idproductos} lg={4} md={6} xs={12}>
                  <ProductCard
                    className={classes.productCard}
                    product={product}
                  />
                </Grid>
              ))}

            {loading &&
              array.map((product) => (
                <Grid item key={product.id} lg={4} md={6} xs={12}>
                  <Card className={clsx(classes.root, classes.productCard)}>
                    <Skeleton
                      variant="rectangular"
                      width={"100%"}
                      height={130}
                    />
                    <Box marginTop={2}>
                      <Skeleton variant="rounded" width={"100%"} height={30} />
                    </Box>
                    <Box marginTop={2}>
                      <Skeleton variant="rounded" width={"100%"} height={30} />
                    </Box>
                    <Box marginTop={2}>
                      <Skeleton variant="rounded" width={"100%"} height={30} />
                    </Box>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination color="primary" count={3} size="small" />
        </Box>
      </Container>

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
    </Page>
  );
};

export default ProductList;
