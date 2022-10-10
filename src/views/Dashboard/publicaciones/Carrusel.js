import React from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@mui/material";

export default function Carrusel() {
  var items = [
    {
      image:
        "https://http2.mlstatic.com/D_NQ_802550-MLA51839578360_102022-OO.webp",
    },
    {
      image:
        "https://http2.mlstatic.com/D_NQ_768463-MLA51738006590_092022-OO.webp",
    },
  ];

  return (
    <Carousel height={300}>
      {items.map((item, i) => (
        <Item key={i} item={item} />
      ))}
    </Carousel>
  );
}

function Item(props) {
  return (
    <Paper>
      <img src={props.item.image} />
    </Paper>
  );
}
