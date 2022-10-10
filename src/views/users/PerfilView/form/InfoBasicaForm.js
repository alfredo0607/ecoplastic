import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button, Box, Snackbar } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Alert } from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import PersonIcon from "@mui/icons-material/Person";
import LoopIcon from "@mui/icons-material/Loop";

import FormInfoBasicaUsuario from "../../UsuarioView/gestion/FormInfoBasicaUsuario";
import LoadingForms from "../../../../components/LoadingForms";
import { infoBasicaValidations } from "../../../../validations/registroUsuarioValidations";
import { getUserToken } from "../../../../helpers/setGetToken";
import {
  fetchRequest,
  setRequestToken,
} from "../../../../helpers/fetchRequest";
import TitleForm from "./TitleForm";
import ContainerFormatedData from "../perfil/ContainerFormatedData";

const schema = yup.object().shape({ ...infoBasicaValidations });

const useStyles = makeStyles((theme) => ({
  inputBasic: {
    marginBottom: "12px",
  },
  labelFixed: {
    backgroundColor:
      theme.palette.mode !== "light" ? theme.palette.background.paper : "white",
  },
}));

const InfoBasicaForm = ({ idUser, setUserInfo }) => {
  const classes = useStyles();
  const isMounted = useRef(true);

  const {
    user: { usuario },
  } = useSelector((state) => state.auth);

  const {
    control,
    register,
    errors,
    reset,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      cedula: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [errorLoading, setErrorLoading] = useState(null);

  const [sendingForm, setSendingForm] = useState(false);
  const [messageResponse, setMessageResponse] = useState(null);

  const [disableButton, setDisableButton] = useState(false);

  const [modeFormatedData, setModeFormatedData] = useState({
    active: false,
    data: null,
  });

  const getInformacionBasica = async (id) => {
    try {
      const token = getUserToken();
      setRequestToken(token);

      const {
        data: {
          data: { usersDetails },
        },
      } = await fetchRequest("/users/get-user-detail/" + id);

      // console.log(data.usersDetails);

      if (isMounted.current) {
        setModeFormatedData((prevState) => ({
          ...prevState,
          data: {
            "Número de cédula": usersDetails["cedula"],
            Nombre: usersDetails["nombre"],
            Género: usersDetails["email"],
            Área: usersDetails["phone"],
          },
        }));

        reset({ ...usersDetails, area: "" });
      }
    } catch (error) {
      let errorMsg = "";

      if (error.response.status === 422) {
        errorMsg =
          "Ocurrio un error obteniendo la información, por favor comprueba que el ID del usuario es correcto y existe y vuelve a intentarlo.";
      } else {
        errorMsg =
          "Ocurrio un error interno en el servidor, por favor intentalo de nuevo más tarde. CODIGO: " +
          error.response.status;
      }

      setErrorLoading(errorMsg);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const handleSendForm = async (updatedData) => {
    setSendingForm(true);

    try {
      const token = getUserToken();
      setRequestToken(token);

      const {
        data: { data },
      } = await fetchRequest(
        `/users/actualizar_info_base_usuario/${idUser}`,
        "PUT",
        { ...updatedData, usuarioActualiza: usuario.idUsuario }
      );

      setMessageResponse({ type: "success", message: data.message });
      setUserInfo((prevState) => ({ ...prevState, ...data.userUpdated }));
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

  const handleOpenFormatedData = () =>
    setModeFormatedData((prevState) => ({
      ...prevState,
      active: !prevState.active,
    }));

  useEffect(() => {
    getInformacionBasica(idUser);

    return () => {
      isMounted.current = false;
    };
  }, [idUser]);

  if (errorLoading) {
    return (
      <>
        <TitleForm title="INFORMACION PERSONAL" icon={PersonIcon} />
        <Alert severity="error">{errorLoading}</Alert>
      </>
    );
  }

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

      <TitleForm title="INFORMACION BASICA" icon={PersonIcon} />
      <form onSubmit={handleSubmit(handleSendForm)}>
        <ContainerFormatedData
          open={modeFormatedData.active}
          title="Información Básica"
          data={modeFormatedData.data}
        >
          <FormInfoBasicaUsuario
            errors={errors}
            register={register}
            classes={classes}
            control={control}
            loading={loading}
            setError={setError}
            clearErrors={clearErrors}
            // disableAll={sectionPermission}
            setDisableButton={setDisableButton}
          />
        </ContainerFormatedData>

        {/* {sectionPermission && (
          <Alert severity="info" style={{ marginBottom: "5px" }}>
            <b>Info:</b> No tienes los permisos suficientes para editar esta
            página.
          </Alert>
        )} */}

        <Box display="flex" justifyContent="flex-end">
          <Box mr={1}>
            <Button
              color="secondary"
              variant="contained"
              startIcon={<LoopIcon />}
              onClick={handleOpenFormatedData}
            >
              {modeFormatedData.active ? "Modo Formulario" : "Modo Lectura"}
            </Button>
          </Box>

          <Button
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            type="submit"
            disabled={loading || disableButton || modeFormatedData.active}
          >
            guardar cambios
          </Button>
        </Box>
      </form>
    </>
  );
};

export default InfoBasicaForm;
