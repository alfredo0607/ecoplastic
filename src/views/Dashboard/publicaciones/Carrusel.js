/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";

export default function Carrusel() {
  var items = [
    {
      image: "/static/images/8112046.jpg",
    },
    {
      image: "/static/images/8112091.jpg",
    },

    {
      image: "/static/images/8111993.jpg",
    },
  ];

  return (
    <Carousel height={450}>
      {items.map((item, i) => (
        <Item key={i} item={item} />
      ))}
    </Carousel>
  );
}

function Item(props) {
  return (
    <Paper style={{ width: "100%" }}>
      <img
        style={{
          width: "100%",
        }}
        src={props.item.image}
      />
    </Paper>
  );
}
