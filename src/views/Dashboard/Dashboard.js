import React, { Fragment } from "react";
import { Container, Grid } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import Page from "../../components/Page";
import Carrusel from "./publicaciones/Carrusel";
import PublicationsCard from "./publicaciones/PublicationsCard";
import Card from "@mui/material/Card";
import ProductList from "../product/productList";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    // paddingTop: theme.spacing(1),
  },

  color1: {
    backgroundColor: "red",
  },
  color2: {
    backgroundColor: "green",
  },
  color3: {
    backgroundColor: "red",
  },
  color4: {
    backgroundColor: "yellow",
    margin: "0px auto",
  },
}));

export default function Dashboard() {
  return <ProductList />;
}
