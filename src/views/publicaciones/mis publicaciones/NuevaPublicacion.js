import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import { convertToRaw, EditorState } from "draft-js";
import {
  Box,
  Button,
  Dialog,
  Slide,
  Grid,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import CloseIcon from "@material-ui/icons/Close";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoadingScreen from "../../../components/ui/LoadingScreen";
import AppbarDialogFullScreen from "../../../components/AppbarDialogFullScreen";
import { getUserToken } from "../../../helpers/setGetToken";
import { fetchRequest, setRequestToken } from "../../../helpers/fetchRequest";
import { newPostValidations } from "../../../validations/crearPublicacionValidations";
import PostForm from "./PostForm";

const schema = yup.object().shape({ ...newPostValidations });

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "fixed",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  dialog: {
    backgroundColor: theme.palette.background.default,
    position: "relative",
  },
  formContainer: {
    display: "flex",
    flexDirection: "row",
    marginLeft: "auto",
    marginRight: "auto",
  },
  inputBasic: {
    marginBottom: "15px",
  },
  labelFixed: {
    backgroundColor:
      theme.palette.mode !== "light" ? theme.palette.background.paper : "white",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function NuevaPublicacion(props) {
  const classes = useStyles();

  const {
    user: { usuario },
  } = useSelector((state) => state.auth);

  const {
    register,
    control,
    handleSubmit,
    errors,
    reset,
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [customErrors, setCustomErrors] = useState({
    type: null,
    message: null,
  });
  const [coverImage, setCoverImage] = useState(null);
  const [aditionalFiles, setAditionalFiles] = useState([]);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleCloseError = () => setCustomErrors({ type: null, message: null });

  const handleClickOpen = () =>
    props.updateFormSettings((actualState) => {
      return { ...actualState, open: true, type: "new" };
    });

  const handleClose = (type) => {
    setCoverImage(null);
    setAditionalFiles([]);
    setEditorState(EditorState.createEmpty());
    reset({});
    props.updateFormSettings({
      open: false,
      data: {},
      type: "new",
    });

    if (type === "clear") {
      reset();
    } else {
      props.updateFormSettings((actualState) => {
        return { ...actualState, open: false };
      });
    }
  };

  const handleSavePublication = async (data) => {
    setLoading(true);

    const commentState = data.commentSwitch ? 1 : 0;

    if (!coverImage) {
      setCustomErrors({
        type: "error",
        message:
          "La publicacion debe contener una imagen descriptiva. Adjunta una por favor",
      });
      return false;
    }

    const editorContent = editorState.getCurrentContent();

    if (editorContent.getPlainText() === "") {
      setCustomErrors({
        type: "error",
        message:
          "La publicacion debe tener contenido textual. Adjunta una breve descripcion por favor",
      });
      return false;
    }

    if (props.formSettings.type === "new") {
      try {
        const token = getUserToken();

        const newPublication = {
          titulo: data.publicationTitle,
          categoria: 1,
          cover: coverImage,
          isoculto: 0,
          iscominetario: commentState,
          descripcion: convertToRaw(editorContent),
          archivosAdicionales: aditionalFiles.map((files) => files.id),
        };

        setRequestToken(token);

        await fetchRequest(
          `/producto/nuevo_producto/${usuario.idUsuario}`,
          "POST",
          newPublication
        );

        setCustomErrors({
          type: "success",
          message: "La publicacion se ha realizado exitosamente",
        });

        props.getPublications();

        handleClose();
      } catch (error) {
        console.log(error);
        let msg = error.response?.data.errores
          ? typeof error.response.data.errores === "string"
            ? error.response.data.errores
            : "Ocurrio un error inesperado, por favor intentalo de nuevo m??s tarde"
          : "Ocurrio un error inesperado, por favor intentalo de nuevo m??s tarde";

        setCustomErrors({ type: "error", message: msg });
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const token = getUserToken();

        const editedPublication = {
          idCreador: usuario.idUsuario,
          titulo: data.publicationTitle,
          tipoPublicacion: data.publicationType.id,
          cover: coverImage,
          videos: data.videoAdd.map((video) =>
            video.name.replace("A??adir: ", "")
          ),
          comentariosActivos: commentState,
          contenido: convertToRaw(editorContent),
          archivosAdicionales: aditionalFiles.map((files) => files.id),
        };

        setRequestToken(token);
        const resp = await fetchRequest(
          `/publicaciones/actualizar_publicacion/${props.formSettings.data.id}`,
          "PUT",
          editedPublication
        );

        const row = resp.data.data.updatedRow;

        const frontendState = {
          publicationTitle: row.titulo,
          publishSwitch: row.estadoPublicacion,
          lastModification: dayjs(row.ultimaActualizacion)
            .locale(es)
            .format("DD [de] MMMM [de] YYYY"),
          rating: row.rating,
          comments: row.numeroComentarios,
        };

        props.setPublication((publications) =>
          publications.map((publication) => {
            if (publication.id === props.formSettings.data.id) {
              return {
                ...publication,
                ...frontendState,
              };
            }
            return publication;
          })
        );

        setCustomErrors({
          type: "success",
          message: "La publicacion se ha actualizado exitosamente",
        });
        handleClose();
      } catch (error) {
        console.log(error);

        let msg = error.response?.data.errores
          ? typeof error.response.data.errores === "string"
            ? error.response.data.errores
            : "Ocurrio un error inesperado, por favor intentalo de nuevo m??s tarde"
          : "Ocurrio un error inesperado, por favor intentalo de nuevo m??s tarde";

        setCustomErrors({ type: "error", message: msg });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {loading && <LoadingScreen />}

      <Button
        color="secondary"
        onClick={handleClickOpen}
        startIcon={<AddCircleIcon />}
      >
        Nueva Publicacion
      </Button>

      <Dialog
        fullScreen
        open={props.formSettings.open}
        TransitionComponent={Transition}
        PaperProps={{ className: classes.dialog }}
      >
        <form onSubmit={handleSubmit(handleSavePublication)}>
          <AppbarDialogFullScreen
            title={
              props.formSettings.type === "new"
                ? "Crea y comparte una nueva publicacion"
                : "Edita y actualiza contenido publicado"
            }
            onClose={handleClose}
          >
            <Box ml="auto">
              <Button
                autoFocus
                color="secondary"
                variant="contained"
                type="submit"
              >
                Guardar
              </Button>
            </Box>
          </AppbarDialogFullScreen>

          <Grid
            container
            direction="row"
            style={{ marginTop: "65px", position: "relative" }}
          >
            <Box p={2} className={classes.formContainer}>
              <PostForm
                control={control}
                register={register}
                errors={errors}
                setError={setError}
                clearErrors={clearErrors}
                setCoverImage={setCoverImage}
                setAditionalFiles={setAditionalFiles}
                setEditorState={setEditorState}
                editorState={editorState}
                coverImage={coverImage}
                aditionalFiles={aditionalFiles}
                customErrors={customErrors}
                handleCloseError={handleCloseError}
              />
            </Box>
          </Grid>
        </form>
      </Dialog>
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
    </>
  );
}

export default NuevaPublicacion;
