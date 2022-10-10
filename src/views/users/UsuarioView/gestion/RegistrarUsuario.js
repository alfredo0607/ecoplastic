import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Dialog,
  Slide,
  Grid,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import { Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoadingForms from "../../../../components/LoadingForms";
import AppbarDialogFullScreen from "../../../../components/AppbarDialogFullScreen";
import FormInfoBasicaUsuario from "./FormInfoBasicaUsuario";
import FormInfoDireccionUsuario from "./FormInfoDireccionUsuario";
import FormInfoNotasUsuario from "./FormInfoNotasUsuario";
import FormInfoTelefonoUsuario from "./FormInfoTelefonoUsuario";
import {
  infoBasicaDefaultValues,
  infoBasicaValidations,
  infoContactoDefaultValues,
  infoContactoValidations,
  infoUbicacionValidations,
} from "../../../../validations/registroUsuarioValidations";
import { getUserToken } from "../../../../helpers/setGetToken";
import {
  fetchRequest,
  setRequestToken,
} from "../../../../helpers/fetchRequest";

const schema = yup.object().shape({
  ...infoBasicaValidations,
  ...infoUbicacionValidations,
  ...infoContactoValidations,
});

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
  inputBasic: {
    marginBottom: "15px",
  },
  labelFixed: {
    backgroundColor:
      theme.palette.mode !== "light" ? theme.palette.background.paper : "white",
  },
  containerContacto: {
    border: `1px solid ${theme.palette.background.default}`,
    borderRadius: "10px",
    paddingTop: "5px",
    paddingBottom: "5px",
    paddingLeft: "10px",
    paddingRight: "10px",
    marginBottom: "10px",
  },
  stickyForms: {
    alignSelf: "flex-start",
    position: "sticky",
    top: 65,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const defaultValues = {
  ...infoBasicaDefaultValues,
  ...infoContactoDefaultValues,
};

function RegistrarUsuario({ updateUsers, open, onClose }) {
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
    getValues,
    watch,
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  // console.log(usuario?.empresa?.idempresa);

  const [openAlert, setOpenAlert] = useState(false);
  const [fieldsWithInfo, setFieldsWithInfo] = useState({});

  const [savingUser, setSavingUser] = useState(false);
  const [messageSaving, setMessageSaving] = useState(null);
  const [checkedAll, setCheckedAll] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  const handleClose = (type) => {
    handleCloseAlert();

    if (type === "clear") {
      reset();
    } else {
      onClose();
    }
  };

  const handleCloseAlert = () => setOpenAlert(false);

  const handleResetForm = (type) => {
    const parsedValues = {
      ...getValues(),
      experienciaLaboral: parseInt(getValues().experienciaLaboral),
    };

    // const { different } = compareObjects(defaultValues, parsedValues);

    // if (different.length > 0) {
    //   setFieldsWithInfo({ fields: different, type });
    //   setOpenAlert(true);
    //   return;
    // }

    handleClose(type);
  };

  const handleSaveUser = async (inf) => {
    try {
      setSavingUser(true);

      const formatedData = {
        businessID: usuario?.empresa?.idempresa,
        ...inf,
      };

      const token = getUserToken();

      setRequestToken(token);
      const { data } = await fetchRequest(
        `users/register_users_operator`,
        "POST",
        formatedData
      );
      const {
        data: { message, user },
      } = data;

      setMessageSaving({ type: "success", message: message });

      const dataFormated = {
        id: user[0]?.idusers,
        idUsuario: user[0]?.idusers,
        cedula: user[0]?.cedula,
        nombre: user[0]?.nombre,
        estado: user[0]?.estadoUsuario === 1 ? "Habilitado" : "Bloqueado",
        acciones: {
          idUsuario: user[0]?.idusers,
          estadoUsuario: user[0]?.estadoUsuario,
        },
        selected: checkedAll,
      };

      console.log(dataFormated);

      updateUsers((users) => [dataFormated, ...users]);

      reset();
      setSavingUser(false);
    } catch (error) {
      console.log(error);
      let msg =
        "Ocurrio un error interno en el servidor, por favor intentalo de nuevo más tarde.";
      if (error.response?.status === 422) msg = error.response.data.errores;
      setMessageSaving({ type: "error", message: msg });
      setSavingUser(false);
    }
  };

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={() => handleResetForm("close")}
        TransitionComponent={Transition}
        PaperProps={{ className: classes.dialog }}
      >
        <Snackbar
          open={!!messageSaving}
          autoHideDuration={6000}
          onClose={() => setMessageSaving(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setMessageSaving(null)}
            severity={messageSaving ? messageSaving.type : "info"}
          >
            {messageSaving?.type === "success"
              ? messageSaving?.message
              : messageSaving?.message}
          </Alert>
        </Snackbar>

        <Dialog
          open={openAlert}
          onClose={handleCloseAlert}
          aria-labelledby="titulo-alerta"
          aria-describedby="descripcion-alerta"
        >
          <DialogTitle id="titulo-alerta">
            {"¿Descartar los cambios realizados?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="descripcion-alerta">
              Se ha detectado que algunos campos tienen información ingresada,
              si aceptas se perderan todos los datos ingresados, los campos son
              los siguientes: <b>{fieldsWithInfo?.fields?.join(", ")}</b>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAlert} color="primary">
              Cancelar
            </Button>
            <Button
              onClick={() => handleClose(fieldsWithInfo.type)}
              color="secondary"
              autoFocus
            >
              Aceptar Y Descartar
            </Button>
          </DialogActions>
        </Dialog>

        <form onSubmit={handleSubmit(handleSaveUser)}>
          <AppbarDialogFullScreen
            title="Registrar nuevo usuario"
            onClose={handleClose}
          >
            <Box ml="auto">
              <Button
                style={{ marginRight: "10px" }}
                type="button"
                onClick={() => handleResetForm("clear")}
              >
                Limpiar Formulario
              </Button>
              <Button
                autoFocus
                color="secondary"
                variant="contained"
                type="submit"
                disabled={disableButton}
              >
                Crear Usuario
              </Button>
            </Box>
          </AppbarDialogFullScreen>

          <Grid
            container
            direction="row"
            style={{ marginTop: "65px", position: "relative" }}
          >
            {savingUser && <LoadingForms />}

            <Grid container item xs={12} md={8}>
              <Box p={2}>
                <FormInfoBasicaUsuario
                  classes={classes}
                  control={control}
                  register={register}
                  errors={errors}
                  setError={setError}
                  clearErrors={clearErrors}
                  setDisableButton={setDisableButton}
                />

                <FormInfoDireccionUsuario
                  classes={classes}
                  register={register}
                  errors={errors}
                />
              </Box>
            </Grid>

            <Grid container item xs={false} md={4} spacing={2}>
              <Grid item xs={false} className={classes.stickyForms}>
                <FormInfoNotasUsuario classes={classes} register={register} />

                <FormInfoTelefonoUsuario
                  classes={classes}
                  register={register}
                  errors={errors}
                />
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Dialog>
    </>
  );
}

export default RegistrarUsuario;
