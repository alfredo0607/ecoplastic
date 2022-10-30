import * as React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector, useDispatch } from "react-redux";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Snackbar,
  Box,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Alert } from "@mui/material";
import { Outlet } from "react-router-dom";
// import TopBar from "./TopBar";
// import { getUserToken } from "src/helpers/setGetToken";
// import { fetchRequest, setRequestToken } from "src/helpers/fetchRequest";
// import { updateTemporalPassword } from "src/redux/actions/authActions";

// import LoadingForms from "src/components/LoadingForms";
// import MemorandoCardUser from "src/components/user_perfil/MemorandoCardLogin";
// import { isTerminatorless } from "@babel/types";
import FormPassword from "../../components/forms/common/FormPassword";
import FormTextRequired from "../../components/forms/common/FormTextRequired";
import { getUserToken } from "../../helpers/setGetToken";
import { fetchRequest, setRequestToken } from "../../helpers/fetchRequest";
import { updateTemporalPassword } from "../../redux/actions/authActions";
import LoadingForms from "../../components/LoadingForms";
import TopBar from "./TopBar";
import FormUbicacionEmpresa from "../../views/users/PerfilView/form/FormUbicacionEmpresa";
import RegisterModel from "../../views/RegisterModel";
import { NotificationsProvider } from "../../context/NotificationsContext";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: "flex",
    height: "100vh",
    width: "100wh",
    flexGrow: 1,
  },

  contentContainer: {
    paddingTop: 74,
    paddingLeft: "12px",
    paddingRight: "12px",
    width: "100%",
    overflowX: "hidden",
  },
}));

const schema = yup.object().shape({
  password: yup
    .string()
    .required("La contraseña es requerida")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
      "La contraseña debe contener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número"
    ),
  password2: yup
    .string()
    .oneOf([yup.ref("password"), null], "Las contraseñas deben coincidir"),
});

const { useState } = React;

const DashboardLayout = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {
    user: { usuario },
  } = useSelector((state) => state.auth);
  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const [open, setOpen] = useState(true);
  const [openMemorandos, setOpenMemorandos] = useState(true);

  const [loading, setLoading] = useState(false);
  const [responseMessages, setResponseMessages] = useState({
    type: null,
    message: null,
  });

  const handleClose = () => setOpen(false);

  const handleCloseMemorandos = () => setOpenMemorandos(false);

  const handleChangePassword = async (newData) => {
    setLoading(true);

    try {
      const token = getUserToken();
      setRequestToken(token);

      const response = await fetchRequest(
        `/users/auth/actualizar_clave_temporal`,
        "PUT",
        {
          idUsuario: usuario.idUsuario,
          nuevaClave: newData.password,
          confirmacionClave: newData.password2,
        }
      );

      const { message } = response.data.data;

      setResponseMessages({
        type: "success",
        message,
      });

      dispatch(updateTemporalPassword());
    } catch (error) {
      let msg =
        "Ocurrio un error inesperado en el envio de la informacion, por favor intentalo de nuevo más tarde.";

      if (error.response?.status === 422) msg = error.response.data.errores;

      setResponseMessages({
        type: "error",
        message: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () =>
    setResponseMessages({ type: null, message: null });

  return (
    <NotificationsProvider>
      <>
        <div className={classes.root}>
          <TopBar />
          <div className={classes.toolbar} />
          <div className={classes.contentContainer}>
            <Outlet />
          </div>
        </div>

        {usuario?.passTemporal && (
          <>
            <Dialog
              fullWidth
              maxWidth="xs"
              open={open}
              onClose={handleClose}
              disableEscapeKeyDown
              aria-labelledby="max-width-dialog-title"
            >
              {loading && <LoadingForms />}
              <form onSubmit={handleSubmit(handleChangePassword)}>
                <DialogTitle id="max-width-dialog-title">
                  Actualizar contraseña
                </DialogTitle>
                <DialogContent>
                  <FormTextRequired />

                  <FormPassword register={register} errors={errors} />
                </DialogContent>
                <DialogActions>
                  <Button color="primary" type="submit">
                    Guardar
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          </>
        )}

        {usuario.lastLogin === null && usuario.rol === "Admin" && (
          <>
            <Dialog
              fullScreen
              fullWidth
              maxWidth="md"
              open={openMemorandos}
              onClose={handleCloseMemorandos}
              disableEscapeKeyDown
              aria-labelledby="dialog-title-memorandos-usuarios"
            >
              {loading && <LoadingForms />}
              <DialogContent>
                <RegisterModel setOpenMemorandos={setOpenMemorandos} />
              </DialogContent>
            </Dialog>
          </>
        )}

        <Snackbar
          open={!!responseMessages.message}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={responseMessages.type || "success"}
          >
            {responseMessages.message || ""}
          </Alert>
        </Snackbar>
      </>
    </NotificationsProvider>
  );
};

export default DashboardLayout;
