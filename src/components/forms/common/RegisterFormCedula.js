import React, { useState, useRef, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import {
  Typography,
  TextField,
  Button,
  CircularProgress,
  Fade,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { fetchRequest, setRequestToken } from "../../../helpers/fetchRequest";
import FormTextRequired from "./FormTextRequired";
import { setTempDatRegister } from "../../../redux/actions/authActions";
import LoadingForms from "../../LoadingForms";
import { getUserToken } from "../../../helpers/setGetToken";
import { yupResolver } from "@hookform/resolvers/yup";

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(1),
  },

  input: {
    padding: "10px",
  },
}));

const RegisterFormCedula = ({ handleNext, from = "register" }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    nit: yup.string().required("El nit es requerido"),
    name: yup.string().required("El nombre es requerido"),
    email: yup.string().required("El email es requerido"),
  });

  const defaultValues = {
    nit: "",
    name: "",
    email: "",
  };

  const {
    register,
    errors,
    handleSubmit,
    control,
    reset,
    getValues,
    watch,
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState(null);
  const [disableButton, setDisableButton] = useState(false);

  const timeoutRef = useRef(null);
  const isMounted = useRef(true);

  const handleSubmitCedula = async ({ nit, name, email }) => {
    setLoading(true);
    seterror(null);

    try {
      setLoading(false);

      if (from === "register") {
        dispatch(setTempDatRegister({ nit, name, email }));
        if (isMounted.current) handleNext();
      } else {
        seterror(
          "El usuario ya se encuentra registrado y tiene una clave asignada."
        );
      }
    } catch (error) {
      if (!isMounted.current) return;
      setLoading(false);
      seterror(
        typeof error.response?.data.errores === "string"
          ? error.response?.data.errores
          : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde."
      );
    }
  };

  const checkNit = async (value) => {
    try {
      const token = getUserToken();
      setRequestToken(token);

      const responseData = await fetchRequest(
        `/users/auth/check_nit/${value}`,
        "POST"
      );

      const { registrado } = responseData.data.data;

      if (registrado) {
        setError("nit", {
          type: "manual",
          message:
            "El nit ingresado ya se encuentra registrado en la base de datos.",
        });
      } else {
        clearErrors("nit");
      }

      setDisableButton(registrado);
    } catch (error) {
      setError("nit", {
        type: "manual",
        message:
          "Ocurrio un error interno consultando el número de cédula, intentalo de nuevo más tarde.",
      });
      setDisableButton(false);
    }
  };

  const handleCheckNit = ({ target }) => {
    const value = target.value;

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      checkNit(value);
    }, 500);
  };

  useEffect(() => {
    return () => (isMounted.current = false);
  }, []);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <>
      {loading && <LoadingForms />}

      <Fade in>
        <form onSubmit={handleSubmit(handleSubmitCedula)}>
          <FormTextRequired />

          <Controller
            name="nit"
            defaultValue={undefined}
            control={control}
            render={({ ref, onChange, value }) => (
              <TextField
                fullWidth
                value={value}
                disabled={loading}
                label="Nit *"
                margin="normal"
                name="nit"
                variant="outlined"
                autoComplete="off"
                onChange={(e) => {
                  onChange(e);
                  handleCheckNit(e);
                }}
                inputProps={{
                  className: classes.input,
                }}
                error={!!errors.nit}
                inputRef={
                  ref || register({ required: "Este campo es requerido" })
                }
                helperText={errors.nit ? errors.nit.message : ""}
              />
            )}
          />

          <TextField
            fullWidth
            disabled={loading}
            label="Nombre *"
            margin="normal"
            name="name"
            variant="outlined"
            autoComplete="off"
            inputProps={{
              className: classes.input,
            }}
            error={!!errors.name}
            inputRef={register({ required: "Este campo es requerido" })}
            helperText={errors.name ? errors.name.message : ""}
          />

          <TextField
            fullWidth
            disabled={loading}
            label="Correo *"
            margin="normal"
            name="email"
            type="email"
            variant="outlined"
            autoComplete="off"
            inputProps={{
              className: classes.input,
            }}
            error={!!errors.email}
            inputRef={register({ required: "Este campo es requerido" })}
            helperText={errors.email ? errors.email.message : ""}
          />

          {error && (
            <Typography color="error" gutterBottom variant="caption">
              {error}
            </Typography>
          )}

          <div className={classes.root}>
            {loading ? <CircularProgress size={24} /> : <div></div>}

            <Button
              disabled={loading || disableButton}
              type="submit"
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardRoundedIcon />}
            >
              Siguiente
            </Button>
          </div>
        </form>
      </Fade>
    </>
  );
};

export default RegisterFormCedula;
