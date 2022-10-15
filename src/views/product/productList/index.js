import React, { useState } from "react";
import { Box, Container, Grid } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Pagination } from "@mui/material";
import Page from "../../../components/Page";
import ProductCard from "./ProductCard";
import data from "./data";
import Carrusel from "../../Dashboard/publicaciones/Carrusel";

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
  const [products] = useState(data);

  return (
    <Page className={classes.root} title="Products">
      <Container maxWidth={false}>
        <Carrusel />

        <Box mt={3}>
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item key={product.id} lg={4} md={6} xs={12}>
                <ProductCard
                  className={classes.productCard}
                  product={product}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination color="primary" count={3} size="small" />
        </Box>
      </Container>
    </Page>
  );
};

export default ProductList;
