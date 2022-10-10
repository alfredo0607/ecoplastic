import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Fade,
  Box,
  Container,
  Typography,
  TextField,
  CircularProgress,
  Button,
} from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";

import FormTextRequired from "../common/FormTextRequired";
import { fetchRequest } from "../../../helpers/fetchRequest";
import { removeTempDatRegister } from "../../../redux/actions/authActions";
import LoadingForms from "../../LoadingForms";

const schema = yup.object().shape({
  preguntaUno: yup
    .string()
    .required("Este campo es requerido")
    .min(5, "Debe contener al menos 5 caracteres")
    .notOneOf(
      [yup.ref("preguntaDos"), null],
      "Las dos preguntas no pueden ser la misma"
    ),

  preguntaDos: yup
    .string()
    .required("Este campo es requerido")
    .min(5, "Debe contener al menos 5 caracteres")
    .notOneOf(
      [yup.ref("preguntaUno"), null],
      "Las dos preguntas no pueden ser la misma"
    ),

  respuestaUno: yup
    .string()
    .required("Este campo es requerido")
    .min(2, "Debe contener al menos 2 caracteres"),
  respuestaDos: yup
    .string()
    .required("Este campo es requerido")
    .min(2, "Debe contener al menos 2 caracteres"),
});

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(1),
  },
}));

const RegisterFormQuestions = ({ handleNext, type = "empresa" }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { registerTemp } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const handleRegister = async (data) => {
    setLoading(true);
    setError(false);

    try {
      if (type === "empresa") {
        const resp = await fetchRequest(
          "/users/auth/register-empresa",
          "POST",
          {
            pregunta1: data.preguntaUno,
            pregunta2: data.preguntaDos,
            respuesta1: data.respuestaUno,
            respuesta2: data.respuestaDos,
            nit: registerTemp.nit,
            nombre_empresa: registerTemp.name,
            email: registerTemp.email,
            cedula: registerTemp.cedulaUsers,
            nombre: registerTemp.nameUsers,
            emailUsers: registerTemp.emailUsers,
            password: registerTemp.password,
          }
        );
        setLoading(false);

        if (resp.status === 201) {
          dispatch(removeTempDatRegister());
          handleNext();
        } else {
          setError(
            "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde."
          );
        }
        return;
      }

      if (type === "usuario") {
        console.log(data);

        const resp = await fetchRequest("/users/auth/register-users", "POST", {
          pregunta1: data.preguntaUno,
          pregunta2: data.preguntaDos,
          respuesta1: data.respuestaUno,
          respuesta2: data.respuestaDos,
          cedula: registerTemp.cedula,
          password: registerTemp.password,
        });
        setLoading(false);

        if (resp.status === 201) {
          dispatch(removeTempDatRegister());
          handleNext();
        } else {
          setError(
            "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde."
          );
        }
        return;
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(
        error.response?.data.errores ||
          "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde."
      );
    }
  };

  return (
    <>
      {loading && <LoadingForms />}

      <Fade in>
        <Box
          display="flex"
          flexDirection="column"
          height="100%"
          justifyContent="center"
        >
          <Container maxWidth="sm">
            <form onSubmit={handleSubmit(handleRegister)}>
              <Box mb={1}>
                <Typography color="textPrimary" variant="h4">
                  Preguntas de seguridad
                  <FormTextRequired />
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Pregunta uno *"
                margin="normal"
                name="preguntaUno"
                variant="outlined"
                type="text"
                autoComplete="off"
                inputRef={register}
                error={!!errors.preguntaUno}
                helperText={
                  errors.preguntaUno ? errors.preguntaUno.message : ""
                }
              />

              <TextField
                fullWidth
                label="Respuesta pregunta uno *"
                margin="normal"
                name="respuestaUno"
                variant="outlined"
                type="password"
                inputRef={register}
                error={!!errors.respuestaUno}
                helperText={
                  errors.respuestaUno ? errors.respuestaUno.message : ""
                }
              />

              <TextField
                fullWidth
                label="Pregunta dos *"
                margin="normal"
                name="preguntaDos"
                variant="outlined"
                type="text"
                autoComplete="off"
                inputRef={register}
                error={!!errors.preguntaDos}
                helperText={
                  errors.preguntaDos ? errors.preguntaDos.message : ""
                }
              />

              <TextField
                fullWidth
                label="Respuesta pregunta dos *"
                margin="normal"
                name="respuestaDos"
                variant="outlined"
                type="password"
                inputRef={register}
                error={!!errors.respuestaDos}
                helperText={
                  errors.respuestaDos ? errors.respuestaDos.message : ""
                }
              />

              {error && (
                <Typography color="error" gutterBottom variant="caption">
                  {error}
                </Typography>
              )}

              <div className={classes.root}>
                {loading ? <CircularProgress size={24} /> : <div></div>}

                <Button
                  disabled={loading}
                  type="submit"
                  variant="contained"
                  color="primary"
                  endIcon={<PersonAddRoundedIcon />}
                >
                  Finalizar
                </Button>
              </div>
            </form>
          </Container>
        </Box>
      </Fade>
    </>
  );
};

export default RegisterFormQuestions;
