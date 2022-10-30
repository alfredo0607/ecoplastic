import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Grid,
  DialogContentText,
  Text,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import LoadingForms from "../../LoadingForms";
import { getUserToken } from "../../../helpers/setGetToken";
import { fetchRequest, setRequestToken } from "../../../helpers/fetchRequest";
import { useSelector } from "react-redux";

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

const defaul = {
  pais: "",
  dep: "",
  city: "",
  adre: "",
  nameR: "",
  phone: "",
  mensaje: "",
};

const schema = yup.object().shape({
  pais: yup.string().required("El mensaje es un campo requerido"),
  dep: yup.string().required("El departamento es un campo requerido"),
  city: yup.string().required("La ciudad es un campo requerido"),
  adre: yup.string().required("La direccion es un campo requerido"),
  nameR: yup.string().required("Nombre del responsable es un campo requerido"),
  phone: yup.string().required("Celular del responsable es un campo requerido"),
  mensaje: yup
    .string()
    .required("El mensaje es un campo requerido")
    .min(10, "El mensaje no puede contener menos de 10 caracteres"),
});

export default function FormPedidos({
  handleClose,
  open,
  id,
  updateStatusSolicitud,
  openRechazada,
  handleCloseRechazada,
  handleCloseDetalle,
  openDetalle,
  solicitud,
}) {
  const classes = useStyles();

  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaul,
  });

  const [sendingForm, setSendingForm] = useState(false);
  const [messageResponse, setMessageResponse] = useState(null);

  const handleCloseSnackbar = () => setMessageResponse(null);

  const handleAprobarSolicitud = async (newData) => {
    try {
      const token = getUserToken();
      setRequestToken(token);

      const {
        data: { data },
      } = await fetchRequest(`/solicitudes/aprobar_solicitud/${id}`, "POST", {
        ...newData,
      });

      updateStatusSolicitud(data.status);
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

  const handleRechazarSolicitud = async () => {
    try {
      const token = getUserToken();
      setRequestToken(token);

      const {
        data: { data },
      } = await fetchRequest(`/solicitudes/rechazar_solicitud/${id}`, "PUT");

      updateStatusSolicitud(data.status);
      handleCloseRechazada();
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

  const {
    user: { usuario },
  } = useSelector((state) => state.auth);

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
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
      >
        <form onSubmit={handleSubmit(handleAprobarSolicitud)}>
          <DialogTitle sx={{ fontSize: "1.2em" }} id="alert-dialog-slide-title">
            {"Datos de entrega"}
          </DialogTitle>

          {sendingForm && <LoadingForms />}

          <Grid item xs={12}>
            <Box marginLeft={2} marginRight={2}>
              <Box mb={2}>
                <Typography variant="caption" color="textSecondary">
                  Los campos marcados con * son obligatorios de llenar
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6} mb={2}>
                  <TextField
                    label="Pais de entrega *"
                    type="text"
                    autoComplete="off"
                    name="pais"
                    spellCheck={false}
                    helperText={errors.pais?.message || ""}
                    placeholder="Eje: Colombia"
                    error={!!errors.pais}
                    inputRef={register()}
                    fullWidth
                    variant="outlined"
                    //   disabled={disableAll}
                    className={classes.inputBasic}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6} mb={2}>
                  <TextField
                    label="Departamento de entrega *"
                    type="text"
                    autoComplete="off"
                    placeholder="Eje: Atlantico"
                    fullWidth
                    inputProps={{ minLength: 3 }}
                    variant="outlined"
                    name="dep"
                    inputRef={register}
                    className={classes.inputBasic}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dep}
                    helperText={errors.dep?.message || ""}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6} mb={2}>
                  <TextField
                    label="Ciudad de entrega *"
                    type="text"
                    autoComplete="off"
                    name="city"
                    spellCheck={false}
                    helperText={errors.city?.message || ""}
                    placeholder="Eje: Barranquilla"
                    error={!!errors.city}
                    inputRef={register()}
                    fullWidth
                    variant="outlined"
                    //   disabled={disableAll}
                    className={classes.inputBasic}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6} mb={2}>
                  <TextField
                    label="Direccion de entrega *"
                    type="text"
                    autoComplete="off"
                    placeholder="Eje: Carrera 19 #25 - 23"
                    fullWidth
                    inputProps={{ minLength: 3 }}
                    variant="outlined"
                    name="adre"
                    inputRef={register}
                    className={classes.inputBasic}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.adre}
                    helperText={errors.adre?.message || ""}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6} mb={2}>
                  <TextField
                    label="Nombre del responsable *"
                    type="text"
                    autoComplete="off"
                    name="nameR"
                    spellCheck={false}
                    helperText={errors.nameR?.message || ""}
                    placeholder="Eje: Alfredo Dominguez"
                    error={!!errors.nameR}
                    inputRef={register()}
                    fullWidth
                    variant="outlined"
                    //   disabled={disableAll}
                    className={classes.inputBasic}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6} mb={2}>
                  <TextField
                    label="Celular del responsable *"
                    type="text"
                    autoComplete="off"
                    placeholder="Eje: 3116534760"
                    fullWidth
                    inputProps={{ minLength: 3 }}
                    variant="outlined"
                    name="phone"
                    inputRef={register}
                    className={classes.inputBasic}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.phone}
                    helperText={errors.phone?.message || ""}
                  />
                </Grid>
              </Grid>
              <Box>
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
            </Box>
          </Grid>

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

      <Dialog
        fullWidth
        maxWidth="xs"
        open={openRechazada}
        onClose={handleCloseRechazada}
        disableEscapeKeyDown
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle sx={{ fontSize: "1.2em" }} id="alert-dialog-slide-title">
          {"Rechazar solicitud"}
        </DialogTitle>

        <DialogContentText margin={2}>
          ¿Esta seguro de rechazar esta solicitud?, una vez rechazada ya no hay
          vuelta atras.
        </DialogContentText>

        <DialogActions>
          <Button
            color="primary"
            type="submit"
            onClick={() => handleCloseRechazada()}
          >
            Calcelar
          </Button>
          <Button
            color="primary"
            type="submit"
            onClick={() => handleRechazarSolicitud()}
          >
            Rechazar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={openDetalle}
        onClose={handleCloseDetalle}
        disableEscapeKeyDown
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle sx={{ fontSize: "1.2em" }} id="alert-dialog-slide-title">
          {"Detalle de entrega"}
        </DialogTitle>

        {solicitud?.idusers_envia === usuario.idUsuario && (
          <DialogContentText margin={2}>
            Para la entrega del producto es necesario que lleve el producto que
            ofreció como intercambio, de lo contrario el proceso no se podra
            llavar acabo.
          </DialogContentText>
        )}

        <Box>
          <Typography margin={2}>Pais : {solicitud?.pedido?.pais} </Typography>
          <Typography margin={2}>
            Departamento : {solicitud?.pedido?.departamento}{" "}
          </Typography>
          <Typography margin={2}>
            Ciudad : {solicitud?.pedido?.ciudad}
          </Typography>
          <Typography margin={2}>
            Direccion : {solicitud?.pedido?.direccion}{" "}
          </Typography>
          <Typography margin={2}>
            Nombre del responsable : {solicitud?.pedido?.nombreResponsable}{" "}
          </Typography>
          <Typography margin={2}>
            Celular del responsable :{solicitud?.pedido?.celularResponsable}{" "}
          </Typography>
          <Typography margin={2}>
            Adicional :{solicitud?.pedido?.mensaje}{" "}
          </Typography>
        </Box>

        <DialogActions>
          <Button
            color="primary"
            type="submit"
            onClick={() => handleCloseDetalle()}
          >
            cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
