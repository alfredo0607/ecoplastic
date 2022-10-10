import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  CircularProgress,
  TextField,
  Button,
  Box,
  Typography,
  Link,
} from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import FormTextRequired from "../common/FormTextRequired";
import { fetchRequest } from "../../../helpers/fetchRequest";

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

const schema = yup.object().shape({
  code: yup
    .string()
    .required("El codigo es necesario es requerido")
    .min(8, "El código no puede contener menos de 8 digitos")
    .max(8, "El código no puede contener más de 8 digitos"),
});

const FormRecoveryEmailSecond = ({ setEmailState, handleNext }) => {
  const classes = useStyles();
  const isMounted = useRef(true);

  const { registerTemp } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSubmitEmailCode = async (data) => {
    setLoading(true);

    try {
      const resp = await fetchRequest(
        `users/auth/recuperar_clave/comprobar_codigo/${registerTemp.cedula}`,
        "POST",
        { code: data.code }
      );

      const { status } = resp.data.data;

      if (status === true) {
        setLoading(false);
        handleNext();
      } else {
        setLoading(false);
        setError("El codigo es incorrecto.");
      }

      if (!isMounted.current) return;
    } catch (error) {
      if (!isMounted.current) return;
      setLoading(false);
      setError(
        typeof error.response?.data.errores === "string" ||
          "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde."
      );
    }
  };

  useEffect(() => {
    return () => (isMounted.current = false);
  }, []);

  return (
    <form onSubmit={handleSubmit(handleSubmitEmailCode)}>
      <Box mb={1}>
        <Typography color="textPrimary" variant="h4">
          Código de confirmación
          <FormTextRequired />
          <Typography variant="caption">
            <Link onClick={() => setEmailState(false)}>Cambiar de email</Link>
          </Typography>
        </Typography>
      </Box>

      <TextField
        fullWidth
        label="Código de confirmación *"
        margin="normal"
        name="code"
        variant="outlined"
        autoComplete="off"
        inputProps={{
          className: classes.input,
        }}
        error={!!errors.code}
        inputRef={register}
        helperText={
          errors.code
            ? errors.code.message
            : "El código de confirmación contiene 8 digitos"
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
      </div>
    </form>
  );
};

export default FormRecoveryEmailSecond;
