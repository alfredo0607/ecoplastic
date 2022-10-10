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
import LoadingForms from "../../LoadingForms";
import FormTextRequired from "../common/FormTextRequired";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("El email es requerido")
    .email("Ingresa un email valido"),
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

const FormRecoveryEmailFirst = ({ handleBack, setEmailState }) => {
  const classes = useStyles();
  const isMounted = useRef(true);
  const { registerTemp } = useSelector((state) => state.auth);
  const [loadingEmail, setLoadingEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { register, errors, handleSubmit, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const getUserEmail = async () => {
    try {
      setLoadingEmail(false);
      const resp = await fetchRequest(
        `/users/auth/obtener_email/${registerTemp.cedula}`
      );

      if (isMounted.current) {
        setLoadingEmail(false);
        setValue("email", resp.data.data.email);
      }
    } catch (error) {
      console.log(error);
      if (isMounted.current) {
        setLoadingEmail(false);
      }
    }
  };

  const handleSubmitEmail = async ({ email }) => {
    setLoading(true);

    try {
      const method =
        registerTemp?.metodoRecuperacion === "email"
          ? "methodEmail"
          : "methodQuestion";

      await fetchRequest(
        `/users/auth/recover-password?methodRecover=${method}`,
        "POST",
        {
          ...registerTemp,
          email,
        }
      );

      if (!isMounted.current) return;

      setLoading(false);
      setEmailState(true);
    } catch (error) {
      if (!isMounted.current) return;
      setLoading(false);
      setError(
        typeof error.response?.data.errores === "string"
          ? error.response?.data.errores
          : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde."
      );
    }
  };

  useEffect(() => {
    getUserEmail();
  }, []);

  useEffect(() => {
    return () => (isMounted.current = false);
  }, []);

  if (loadingEmail) {
    return (
      <Box justify="center">
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <>
      {loading && <LoadingForms />}

      <form onSubmit={handleSubmit(handleSubmitEmail)}>
        <FormTextRequired />

        <TextField
          fullWidth
          label="email"
          margin="normal"
          name="email"
          variant="outlined"
          autoComplete="off"
          inputProps={{
            className: classes.input,
          }}
          error={!!errors.email}
          inputRef={register}
          helperText={
            errors.email
              ? errors.email.message
              : "Se enviara un código de confirmación al correo indicado"
          }
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
    </>
  );
};

export default FormRecoveryEmailFirst;
