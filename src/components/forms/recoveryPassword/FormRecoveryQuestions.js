import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Box,
  CircularProgress,
  TextField,
  Button,
  Typography,
} from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import { fetchRequest } from "../../../helpers/fetchRequest";
import FormTextRequired from "../common/FormTextRequired";

const schema = yup.object().shape({
  respuestaUno: yup.string().required("Este campo es requerido"),
  respuestaDos: yup.string().required("Este campo es requerido"),
});

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  button: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      margin: theme.spacing(1, 0),
    },
  },
}));

const FormRecoveryQuestions = ({ handleBack, handleNext }) => {
  const classes = useStyles();

  const isMounted = useRef(true);
  const { registerTemp } = useSelector((state) => state.auth);

  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questions, setQuestions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const getQuestionsUser = async () => {
    try {
      const resp = await fetchRequest(
        `users/auth/recuperar_clave/obtener_preguntas/${registerTemp.cedula}`
      );

      if (isMounted.current) {
        setLoadingQuestions(false);
        setQuestions(resp.data.data.questions);
      }
    } catch (error) {
      console.log(error);
      if (isMounted.current) {
        setLoadingQuestions(false);
        setError(
          typeof error.response?.data.errores === "string" ||
            "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde."
        );
      }
    }
  };

  const handleSubmitQuestions = async (data) => {
    setLoading(true);

    try {
      const method =
        registerTemp.metodoRecuperacion === "preguntas"
          ? "methodQuestion"
          : "methodEmail";

      console.log(data);

      await fetchRequest(
        `/users/auth/recover-password?methodRecover=${method}`,
        "POST",
        {
          ...registerTemp,
          ...data,
        }
      );

      if (!isMounted.current) return;

      setLoading(false);
      handleNext(true);
    } catch (error) {
      if (!isMounted.current) return;

      setLoading(false);
      setError(
        typeof error.response?.data.errores === "string"
          ? error.response.data.errores
          : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde."
      );
    }
  };

  useEffect(() => {
    getQuestionsUser();
  }, []);

  useEffect(() => {
    return () => (isMounted.current = false);
  }, []);

  if (loadingQuestions) {
    return (
      <Box justify="center">
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitQuestions)}>
      <FormTextRequired />

      <TextField
        fullWidth
        label={`${questions.preguntaUno || ""} *`}
        placeholder="Tu respuesta *..."
        margin="normal"
        name="respuestaUno"
        variant="outlined"
        autoComplete="off"
        inputProps={{
          className: classes.input,
        }}
        error={!!errors.respuestaUno}
        inputRef={register}
        helperText={errors.respuestaUno ? errors.respuestaUno.message : ""}
      />

      <TextField
        fullWidth
        label={`${questions.preguntaDos || ""} *`}
        placeholder="Tu respuesta *..."
        margin="normal"
        name="respuestaDos"
        variant="outlined"
        autoComplete="off"
        inputProps={{
          className: classes.input,
        }}
        error={!!errors.respuestaDos}
        inputRef={register}
        helperText={errors.respuestaDos ? errors.respuestaDos.message : ""}
      />

      {error && (
        <Typography color="error" gutterBottom variant="caption">
          {error}
        </Typography>
      )}

      <div className={classes.root}>
        <Button
          disabled={loading}
          type="submit"
          variant="contained"
          color="primary"
          className={classes.button}
          endIcon={<ArrowForwardRoundedIcon />}
        >
          Continuar
        </Button>

        {loading ? <CircularProgress size={24} /> : <div></div>}

        <Button
          onClick={handleBack}
          disabled={loading}
          variant="outlined"
          color="primary"
          className={classes.button}
          startIcon={<ArrowBackRoundedIcon />}
        >
          Regresar
        </Button>
      </div>
    </form>
  );
};

export default FormRecoveryQuestions;
