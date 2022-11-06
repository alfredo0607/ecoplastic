import React, { useState, useEffect } from "react";

import {
  Box,
  Switch,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  Autocomplete,
  createFilterOptions,
  FormControlLabel,
  useMediaQuery,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
//import MUIEditor from 'react-mui-draft-wysiwyg';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import CloseIcon from "@mui/icons-material/Close";

import { Controller } from "react-hook-form";

import TextButtonExplorer from "../../../components/file_explorer/TextButtonExplorer";
import AutocompleteWithRequest from "../../../components/AutocompleteWithRequest";
import { getUserToken } from "../../../helpers/setGetToken";
import { fetchRequest, setRequestToken } from "../../../helpers/fetchRequest";
import { getMimeTypesForFiles } from "../../../util/getMimeTypesForFiles";

const useStyles = makeStyles((theme) => ({
  contenidoTextualContainner: {
    width: "100%",
    marginBottom: theme.spacing(3),
  },
  contenidoTextual: {
    "& h3": {
      padding: "20px",
    },
  },
  imagePreview: {
    //width: "800px",
    height: "150px",
    borderColor: "gray",
  },
  filesPreview: {
    width: "100% ",
    height: "auto",
    display: "flex",
    alignItems: "center",
  },
  previewContainer: {
    width: "100%",
    height: "100%",
    marginTop: "-40px",
    overflow: "hidden",
    objectFit: "cover",
  },
  switchContainer: {
    marginTop: "10px",
    marginBottom: "10px",
  },
  taggs: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
  labelFixed: {
    backgroundColor:
      theme.palette.mode !== "light" ? theme.palette.background.paper : "white",
  },
  rowCustom: {
    width: "100%",
  },
  tipoPublication: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
}));

const filter = createFilterOptions();

/*********************************************** */
/**************** FUNCTION START *****************/
/*********************************************** */

function PostForm({
  loading = false,
  register,
  errors,
  control,
  setEditorState,
  editorState,
  setAditionalFiles,
  setCoverImage,
  coverImage,
  aditionalFiles,
  customErrors,
  handleCloseError,
}) {
  const classes = useStyles();
  const [error, setError] = useState(null);
  const matches = useMediaQuery("(min-width:600px)");

  /********************* TEXT EDITOR **********************/

  const handleChangeEditor = (newState) => {
    setEditorState(newState);
  };

  /******************* END TEXT EDITOR ***********************/

  const handleCloseCover = () => {
    setCoverImage(null);
    console.log(coverImage);
  };

  const handleCloseFiles = () => {
    setAditionalFiles([]);
  };

  const handleUploadImage = (data) => {
    setCoverImage(data);
  };

  const handleUploadFile = (data) => {
    setAditionalFiles(data);
    console.log(data);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Box className={classes.contenidoTextualContainner}>
          <Card>
            <CardContent className={classes.contenidoTextual}>
              <Typography variant="h3" color="textPrimary">
                Titulo de la publicacion
                {loading && (
                  <CircularProgress
                    color="secondary"
                    size={14}
                    style={{ marginLeft: "5px" }}
                  />
                )}
              </Typography>

              <TextField
                variant="outlined"
                label="Titulo*"
                type="text"
                error={!!errors.publicationTitle}
                autoComplete="off"
                name="publicationTitle"
                className={classes.inputBasic}
                inputRef={register()}
                // {...register("publicationTitle")}
                spellCheck={false}
                placeholder="Titulo de la publicacion"
                helperText={errors.publicationTitle?.message || ""}
                fullWidth
              />

              {coverImage != null ? (
                <Grid
                  item
                  md={12}
                  border={1}
                  className={classes.imagePreview}
                  mt={1}
                  width={matches ? "800px" : "320px"}
                >
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="flex-start"
                  >
                    <IconButton
                      aria-label="close"
                      style={{ marginLeft: "90%" }}
                      onClick={handleCloseCover}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  <Box
                    className={classes.previewContainer}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <img
                      src={`https://ecoplastic.herokuapp.com/${coverImage}`}
                      alt="preview"
                    ></img>
                  </Box>
                </Grid>
              ) : null}

              <Snackbar
                open={!!customErrors.type}
                autoHideDuration={6000}
                onClose={handleCloseError}
              >
                <Alert
                  severity={customErrors.type || "info"}
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
                  {customErrors.message}
                </Alert>
              </Snackbar>

              <Typography variant="h3" color="textPrimary">
                Contenido
              </Typography>

              <Editor
                editorState={editorState}
                onEditorStateChange={handleChangeEditor}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                editorStyle={{
                  height: "100%",
                  border: "1px solid gray",
                  borderRadius: "5px",
                  padding: "10px",
                }}
                toolbarStyle={{
                  border: "1px solid gray",
                  color: "black",
                }}
                wrapperStyle={{
                  border: "1px solid gray",
                  borderRadius: "5px",
                  padding: "10px",
                }}
              />
            </CardContent>
          </Card>
        </Box>
      </Grid>

      <Grid item xs={12} md={4}>
        <Box className={classes.contenidoMultimedia}>
          <Card>
            <CardContent>
              <Grid container>
                <Grid item sm={12}>
                  <TextButtonExplorer
                    padding={50}
                    textToShow="Selecciona una imagen de portada"
                    colorButton="primary"
                    fullWidth={true}
                    style={{ margin: "5px" }}
                    mainFrame={{
                      title: "Selecciona la imagen",
                      multiple: false,
                      types: getMimeTypesForFiles(["media"]),
                      onEndSelected: (data) => {
                        console.log(data);
                        handleUploadImage(data[0].rutaCompleta);
                      },
                    }}
                  />
                  <TextButtonExplorer
                    textToShow="Adjunta archivos adicionales"
                    colorButton="primary"
                    fullWidth={true}
                    style={{ margin: "5px" }}
                    mainFrame={{
                      title: "Selecciona los archivos que deseas compartir",
                      multiple: false,
                      types: getMimeTypesForFiles(["png", "jpg", "jpeg"]),
                      onEndSelected: (data) => handleUploadFile(data),
                    }}
                  />
                </Grid>

                {aditionalFiles.length > 0
                  ? aditionalFiles.map((file) => (
                      <Grid
                        key={file.id}
                        item
                        md={12}
                        className={classes.filesPreview}
                      >
                        <Typography variant="h6">{file.fileName}</Typography>
                        <IconButton
                          aria-label="close"
                          onClick={handleCloseFiles}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Grid>
                    ))
                  : null}

                <Box display="flex" flexDirection="column">
                  <Controller
                    name="commentSwitch"
                    control={control}
                    defaultValue={true}
                    render={({ onChange, onBlur, value, name, ref }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={value}
                            onChange={(e, newValue) => onChange(newValue)}
                          />
                        }
                        ref={ref}
                        label="Habilitar Comentarios"
                      />
                    )}
                  />
                </Box>

                <Box className={classes.rowCustom}>
                  <Controller
                    name="category"
                    control={control}
                    defaultValue={[]}
                    render={({ onChange, onBlur, value, name, ref }) => (
                      <AutocompleteWithRequest
                        multiple
                        error={!!errors.category}
                        filterSelectedOptions
                        margin="normal"
                        limitTags={4}
                        inputRef={ref}
                        ChipProps={{ size: "small" }}
                        value={value}
                        onChange={(event, newValue) => onChange(newValue)}
                        label="Categoria"
                        noOptionsText="No se encontraron registros"
                        placeholder="Categorias"
                        requestURL={`/producto/categorias`}
                        helperText={errors.category?.message || ""}
                      />
                    )}
                  />
                </Box>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </Grid>
  );
}

const filtersReducer = (state, { type, payload }) => {
  if (type === "UPDATED_AREAS_SOLICITUD") {
    return {
      ...state,
      areas: payload,
    };
  }

  if (type === "UPDATED_TYPE_PUBLICATION") {
    return {
      ...state,
      typeSolicitud: payload,
    };
  }

  return state;
};

const taggsList = [
  { name: "The Shawshank Redemption", isNew: true, id: null },
  { name: "The Godfather", isNew: true, id: null },
  { name: "The Godfather: Part II", isNew: true, id: null },
];

export default PostForm;
