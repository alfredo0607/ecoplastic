/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
import {
  Stack,
  Grid,
  CardMedia,
  Typography,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ComentariosCard from "./ComentariosCard";

function Item(props) {
  return (
    <Paper>
      <img
        style={{ width: "100%" }}
        src={`https://ecoplastic.herokuapp.com/uploads/file_explorer_usuarios/${props.item.nombreServidor}`}
      />
    </Paper>
  );
}

const useStyles = makeStyles((theme) => ({
  card: {
    height: "730px",
  },
  cardMobile: {
    height: "270px",
  },
}));

const DetailPublication = ({
  publicacion,
  editorState,
  imagenes,
  comentarios,
}) => {
  return (
    <Stack spacing={2}>
      <Grid textAlign="center">
        <CardMedia
          component="img"
          height="300"
          image={`https://ecoplastic.herokuapp.com/${publicacion.cover}`}
          alt={publicacion.publicationTitle}
          sx={{ borderRadius: "5px" }}
        />
        <Typography
          variant="h5"
          color="textPrimary"
          sx={{
            padding: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Publicado el {publicacion.date} por{" "}
          <Avatar
            alt={publicacion.publicedBy}
            sx={{ marginLeft: 1, marginRight: 1 }}
            src={`https://ecoplastic.herokuapp.com/uploads/images/imagenes_usuarios/${publicacion.avatar}`}
          />{" "}
          {publicacion.publicedBy}
        </Typography>
      </Grid>
      <Grid>
        <Typography typography>{publicacion.publicationContain}</Typography>

        {imagenes.length !== 0 && (
          <Carousel height={500}>
            {imagenes.map((item, i) => (
              <Item key={i} item={item} />
            ))}
          </Carousel>
        )}
      </Grid>
      <Grid>
        <Typography marginTop={2} marginBottom={4} fontSize={18} typography>
          Comentarios
        </Typography>

        {comentarios.length !== 0 &&
          comentarios.map((data) => (
            <ComentariosCard key={data.idcomentarios} data={data} />
          ))}

        {comentarios.length === 0 && (
          <Typography marginTop={2} marginBottom={4} fontSize={18} typography>
            No hay comentario, deja tu primer comentario.
          </Typography>
        )}
      </Grid>
    </Stack>
  );
};

export default DetailPublication;
