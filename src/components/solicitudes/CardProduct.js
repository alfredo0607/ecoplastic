import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

export default function CardProduct({ data }) {
  return (
    <Link to={`/app/product/${data?.idproductos}`}>
      <Card sx={{ maxWidth: 200 }}>
        <CardMedia
          component="img"
          alt="green iguana"
          height="140"
          image={`http://localhost:3006/${data?.cover}`}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {data?.titulo}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Detalle del producto</Button>
        </CardActions>
      </Card>
    </Link>
  );
}
