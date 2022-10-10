import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button, Box, Snackbar } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import SaveIcon from "@mui/icons-material/Save";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import LoopIcon from "@mui/icons-material/Loop";

import FormInfoDireccionUsuario from "../../UsuarioView/gestion/FormInfoDireccionUsuario";
import TitleForm from "./TitleForm";

import { Alert } from "@mui/material";
import LoadingForms from "../../../../components/LoadingForms";
import { infoUbicacionValidations } from "../../../../validations/registroUsuarioValidations";
import { getUserToken } from "../../../../helpers/setGetToken";
import {
  fetchRequest,
  setRequestToken,
} from "../../../../helpers/fetchRequest";
import ContainerFormatedData from "../perfil/ContainerFormatedData";

const schema = yup.object().shape({ ...infoUbicacionValidations });

const useStyles = makeStyles((theme) => ({
  inputBasic: {
    marginBottom: "12px",
  },
  labelFixed: {
    backgroundColor:
      theme.palette.mode !== "light" ? theme.palette.background.paper : "white",
  },
}));

const InfoUbicacionForm = ({ idUser }) => {
  const classes = useStyles();

  const {
    user: { permisos, usuario },
  } = useSelector((state) => state.auth);

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  const [loading, setLoading] = useState(true);
  const [errorLoading, setErrorLoading] = useState(null);

  const [sendingForm, setSendingForm] = useState(false);
  const [messageResponse, setMessageResponse] = useState(null);

  const [modeFormatedData, setModeFormatedData] = useState({
    active: false,
    data: null,
  });

  const getInfomacionUbicacion = async (id) => {
    try {
      const token = getUserToken();
      setRequestToken(token);

      const {
        data: {
          data: { response },
        },
      } = await fetchRequest("/users/obtener_info_direccion/" + id);

      reset(response);
      setModeFormatedData((prevState) => ({
        ...prevState,
        data: {
          "Ciudad de residencia": response["ciudad"],
          Localidad:
            response["localida"] === ""
              ? "No Registrado"
              : response["localida"],
          Barrio:
            response["barrio"] === "" ? "No Registrado" : response["barrio"],
          Dirección:
            response["direccion"] === ""
              ? "No Registrado"
              : response["direccion"],
          Adicionales:
            response["adicionales"] === ""
              ? "No Registrado"
              : response["adicionales"],
        },
      }));
    } catch (error) {
      let errorMsg = "";

      if (error.response?.status === 422) {
        errorMsg = error.response.data.errores;
      } else {
        errorMsg =
          "Ocurrio un error interno en el servidor, por favor intentalo de nuevo más tarde. CODIGO: " +
          error.response.status;
      }

      setErrorLoading(errorMsg);
    } finally {
      setLoading(false);
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
        `/users/registrar_informacion_direccion/${idUser}`,
        "PUT",
        {
          ...updatedData,
          usuarioActualiza: usuario.idUsuario,
        }
      );

      setMessageResponse({ type: "success", message: data.message });
    } catch (error) {
      let errorMsg = "";

      if (error.response.status === 422) {
        errorMsg = error.response.data.errores
          ? error.response.data.errores
          : "Ocurrio un error enviando la información, por favor asegurate de tener internet";
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
    getInfomacionUbicacion(idUser);
  }, [idUser]);

  if (errorLoading) {
    return (
      <>
        <TitleForm title="INFORMACION UBICACION" icon={LocationCityIcon} />
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

      <TitleForm title="INFORMACION UBICACION" icon={LocationCityIcon} />
      <form onSubmit={handleSubmit(handleSendForm)}>
        <ContainerFormatedData
          open={modeFormatedData.active}
          title="Información de Ubicación"
          data={modeFormatedData.data}
        >
          <FormInfoDireccionUsuario
            register={register}
            classes={classes}
            loading={loading}
            errors={errors}
            // disableAll={sectionPermission}
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
            // disabled={loading || sectionPermission}
          >
            guardar cambios
          </Button>
        </Box>
      </form>
    </>
  );
};

export default InfoUbicacionForm;
