/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  DialogContentText,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { FaRegPaperPlane as FaRegPaperPlaneIcon } from "react-icons/fa";
import { Alert, Autocomplete } from "@mui/material";
import { fetchRequest, setRequestToken } from "../../helpers/fetchRequest";
import { getUserToken } from "../../helpers/setGetToken";
import LoadingForms from "../LoadingForms";

const schema = yup.object().shape({
  productoIntercambio: yup
    .mixed()
    .notOneOf(["", null], "Por favor elige una opción valida"),
  mensaje: yup
    .string()
    .required("El mensaje es un campo requerido")
    .min(10, "El mensaje no puede contener menos de 10 caracteres"),
});

const useStyles = makeStyles((theme) => ({
  titleText: {
    color:
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.7)"
        : "rgba(255, 255, 255, 0.9)",
  },
  title: {
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  },
  optionContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  optionBadge: {
    border: "none",
    borderRadius: "5px",
    fontSize: theme.spacing(1.7),
    padding: "2px 5px",
  },
}));

const FormSolicitud = ({ handleClose, open, idPublicacion }) => {
  const classes = useStyles();

  const {
    user: { usuario },
  } = useSelector((state) => state.auth);

  const { register, control, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const [sendingForm, setSendingForm] = useState(false);
  const [messageResponse, setMessageResponse] = useState(null);
  const [publication, setPublication] = useState([]);

  const handleCloseSnackbar = () => setMessageResponse(null);

  const getPublications = async () => {
    try {
      const token = getUserToken();

      setRequestToken(token);
      const response = await fetchRequest(
        `/producto/get_mis_publicacione/${
          usuario.idUsuario
        }?page=${0}&limit=${100}&showAll=1`,
        "POST"
      );

      const { rows } = response.data.data;

      const dataFormated = rows.map((publicacion) => ({
        id: publicacion.idproductos,
        publicationTitle: publicacion.titulo,
      }));

      setPublication(dataFormated);
    } catch (error) {
      console.log(error);
      let msg = error.response?.data.errores
        ? typeof error.response.data.errores === "string"
          ? error.response.data.errores
          : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde"
        : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde";

      setMessageResponse({ type: "error", message: msg });
    } finally {
      setSendingForm(false);
    }
  };

  const handleSendSolicitud = async (newData) => {
    // setSendingForm(true);

    try {
      const token = getUserToken();
      setRequestToken(token);

      const {
        data: { data },
      } = await fetchRequest(
        `/solicitudes/nueva_solicitud/${usuario.idUsuario}/${idPublicacion}`,
        "POST",
        {
          mensaje: newData.mensaje,
          arrayProductInt: [newData.productoIntercambio],
        }
      );

      handleClose();
      setMessageResponse({ type: "success", message: data.message });
    } catch (error) {
      let errorMsg = "";

      if (error.response.status === 422) {
        errorMsg =
          "Ocurrio un error creando la solicitud, por favor asegurate de tener internet y vuelve a intentarlo más tarde.";
      } else {
        errorMsg =
          "Ocurrio un error interno en el servidor, por favor intentalo de nuevo más tarde. CODIGO: " +
          error.response.status;
      }

      setMessageResponse({ type: "error", message: errorMsg });
    } finally {
      setSendingForm(false);
    }
  };

  useEffect(() => {
    getPublications();
  }, []);

  return (
    <>
      <Snackbar
        open={!!messageResponse}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={messageResponse?.type || "success"}
        >
          {messageResponse?.message}
        </Alert>
      </Snackbar>

      <Dialog
        maxWidth={true}
        open={open}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
      >
        <DialogTitle sx={{ fontSize: "1.2em" }} id="alert-dialog-slide-title">
          {"Enviar solicitud de intercambio"}
        </DialogTitle>

        <form onSubmit={handleSubmit(handleSendSolicitud)}>
          <DialogContent>
            {sendingForm && <LoadingForms />}

            <DialogContentText>
              Escribe un comentario acerca de tu opinión sobre la publicación,
              que te gusto y que no te gusto.
            </DialogContentText>

            <Controller
              name="productoIntercambio"
              control={control}
              defaultValue={null}
              render={({ onChange, value, ref }) => (
                <Autocomplete
                  key={publication.id}
                  autoHighlight
                  fullWidth
                  id="tipo-solicitud-creacion"
                  noOptionsText="Sin Opciones"
                  ref={ref}
                  value={value}
                  options={publication}
                  onChange={(index, data) => onChange(data)}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  getOptionLabel={(option) => option.publicationTitle || ""}
                  renderOption={(props, option) => {
                    return (
                      <li {...props}>
                        <div
                          className={classes.optionContainer}
                          key={option.id}
                        >
                          <Typography key={option.id.toString()}>
                            {option.publicationTitle}
                          </Typography>
                        </div>
                        {}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!errors.productoIntercambio}
                      helperText={errors?.productoIntercambio?.message || ""}
                      label="Tipo de solicitud"
                      placeholder="Selecciona el producto que deseas intercambiar"
                      variant="outlined"
                      key={params.productoIntercambio}
                    />
                  )}
                />
              )}
            />

            <Box mt={2}>
              <TextField
                fullWidth
                multiline
                variant="outlined"
                name="mensaje"
                label="Mensaje / Asunto"
                placeholder="Ingresa un mensaje del tema a tratar en tu solicitud"
                type="text"
                spellCheck="off"
                rows={4}
                error={!!errors.mensaje}
                helperText={errors?.mensaje?.message || ""}
                inputRef={register({ required: "Este campo es requerido" })}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={() => handleClose()}>
              Cancelar
            </Button>
            <Button type="submit" color="primary">
              Enviar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default FormSolicitud;
