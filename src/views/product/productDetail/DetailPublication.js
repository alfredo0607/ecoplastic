import React from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import {
  Stack,
  Divider,
  Grid,
  CardMedia,
  Typography,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import ReactPlayer from "react-player";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const useStyles = makeStyles((theme) => ({
  card: {
    height: "730px",
  },
  cardMobile: {
    height: "270px",
  },
}));

const DetailPublication = ({ publicacion, editorState }) => {
  const classes = useStyles();
  const matches = useMediaQuery("(min-width:600px)");

  console.log(publicacion);

  return (
    <Stack spacing={2}>
      <Grid textAlign="center">
        <CardMedia
          component="img"
          height="300"
          image={`http://localhost:3006/${publicacion.cover}`}
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
            sx={{ display: "inline-block", marginLeft: 1, marginRight: 1 }}
            src={`http://localhost:3006/uploads/images/imagenes/usuarios/${publicacion.avatar}`}
          />{" "}
          {publicacion.publicedBy}
        </Typography>
      </Grid>
      {/* {editorState && (
        <Grid>
          <Editor
            readOnly
            toolbarHidden
            editorState={editorState}
            // onEditorStateChange={setEditorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            editorStyle={{
              height: "100%",
              padding: "10px",
            }}
          />
        </Grid>
      )} */}
    </Stack>
  );
};

export default DetailPublication;
