import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { CircularProgress, Button, Typography, Box } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import InputRoundedIcon from "@mui/icons-material/InputRounded";
import FormPassword from "../common/FormPassword";

import { fetchRequest } from "../../../helpers/fetchRequest";
import FormTextRequired from "../common/FormTextRequired";
import LoadingForms from "../../LoadingForms";

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

const FormRecoveryPassword = ({ handleNext }) => {
  const classes = useStyles();

  const isMounted = useRef(true);
  const { registerTemp } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSubmitChangePassword = async (data) => {
    setLoading(true);

    try {
      await fetchRequest("/users/auth/cambiar_clave", "POST", {
        cedula: registerTemp.cedula,
        nuevaClave: data.password,
        confirmacionClave: data.password2,
      });

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
    return () => (isMounted.current = false);
  }, []);

  return (
    <>
      {loading && <LoadingForms />}

      <form onSubmit={handleSubmit(handleSubmitChangePassword)}>
        <Box mb={1}>
          <Typography color="textPrimary" variant="h4">
            Nueva Contraseña
            <FormTextRequired />
          </Typography>
        </Box>

        <FormPassword register={register} errors={errors} />

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
            color="secondary"
            className={classes.button}
            endIcon={<InputRoundedIcon />}
          >
            Reestablecer
          </Button>

          {loading ? <CircularProgress size={24} /> : <div></div>}
        </div>
      </form>
    </>
  );
};

export default FormRecoveryPassword;
