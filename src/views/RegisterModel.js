import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button, Box, Snackbar } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Alert } from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import LoadingForms from "../components/LoadingForms";
import FormUbicacionEmpresa from "./users/PerfilView/form/FormUbicacionEmpresa";
import { getUserToken } from "../helpers/setGetToken";
import { fetchRequest, setRequestToken } from "../helpers/fetchRequest";
import FormInfoDireccionUsuario from "./users/UsuarioView/gestion/FormInfoDireccionUsuario";
import { checkUserSession } from "../redux/actions/authActions";

const schema = yup.object().shape({
  ciudade: yup.string().required("El campo de ciudad no puede ir vacio"),
  direccione: yup.string().required("El campo de direccion no puede ir vacio"),
  paise: yup.string().required("El campo de pais no puede ir vacio"),
  phonee: yup.string().required("El campo de celular no puede ir vacio"),
  ciudad: yup.string().required("El campo de ciudad no puede ir vacio"),
  direccion: yup.string().required("El campo de direccion no puede ir vacio"),
  localida: yup.string().required("El campo de localidad no puede ir vacio"),
  barrio: yup.string().required("El campo de barrio no puede ir vacio"),
});

const useStyles = makeStyles((theme) => ({
  inputBasic: {
    marginBottom: "12px",
  },
  labelFixed: {
    backgroundColor:
      theme.palette.mode !== "light" ? theme.palette.background.paper : "white",
  },
}));

const RegisterModel = ({ setOpenMemorandos }) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const {
    user: { usuario },
  } = useSelector((state) => state.auth);

  const { control, register, errors, handleSubmit, setError, clearErrors } =
    useForm({
      resolver: yupResolver(schema),
      defaultValues: {
        cedula: "",
      },
    });

  const [sendingForm, setSendingForm] = useState(false);
  const [messageResponse, setMessageResponse] = useState(null);

  const [disableButton, setDisableButton] = useState(false);

  const handleSendForm = async (updatedData) => {
    setSendingForm(true);

    try {
      const token = getUserToken();
      setRequestToken(token);

      const {
        data: { data },
      } = await fetchRequest(
        `/users/registrar_informacion_direccion_admin/${usuario?.idUsuario}/${usuario?.empresa.idempresa}`,
        "POST",
        { ...updatedData }
      );

      setMessageResponse({ type: "success", message: data.message });
      setOpenMemorandos(false);
      dispatch(checkUserSession());
    } catch (error) {
      let errorMsg = "";

      if (error.response.status === 422) {
        errorMsg =
          "Ocurrio un error creando la nota, por favor asegurate de tener internet";
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

  const handleCloseSnackbar = () => setMessageResponse(null);

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

      {sendingForm && <LoadingForms />}

      <form onSubmit={handleSubmit(handleSendForm)}>
        <FormUbicacionEmpresa
          errors={errors}
          register={register}
          classes={classes}
          control={control}
          setError={setError}
          clearErrors={clearErrors}
          // disableAll={sectionPermission}
          setDisableButton={setDisableButton}
        />

        <FormInfoDireccionUsuario
          errors={errors}
          register={register}
          classes={classes}
          control={control}
          setError={setError}
          clearErrors={clearErrors}
          type={"admin"}
        />

        <Box display="flex" justifyContent="flex-end">
          <Button
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            type="submit"
            disabled={disableButton}
          >
            guardar cambios
          </Button>
        </Box>
      </form>
    </>
  );
};

export default RegisterModel;
