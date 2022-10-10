import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Fade,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import FormTextRequired from "../common/FormTextRequired";
import { getUserToken } from "../../../helpers/setGetToken";
import { fetchRequest, setRequestToken } from "../../../helpers/fetchRequest";
import { setTempDatRegister } from "../../../redux/actions/authActions";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("El email es requerido")
    .email("Ingresa un email valido"),

  nameUsers: yup.string().required("El nombre es requerido"),
  cedula: yup.string().required("La cedula es requerida"),
});

const defaultValues = {
  cedula: "",
  nameUsers: "",
  email: "",
};

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(1),
  },
}));

const RegisterForm = ({ handleNext }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState(null);
  const [disableButton, setDisableButton] = useState(false);
  const timeoutRef = useRef(null);

  const { register, errors, handleSubmit, setError, clearErrors, control } =
    useForm({
      resolver: yupResolver(schema),
      defaultValues,
    });

  const handleSubmitSecondForm = async (data) => {
    setLoading(true);
    seterror(null);

    try {
      const dataUsers = {
        nameUsers: data.nameUsers,
        emailUsers: data.email,
        cedulaUsers: data.cedula,
      };

      dispatch(setTempDatRegister(dataUsers));
      setLoading(false);
      handleNext();
    } catch (error) {
      setLoading(false);
      seterror(
        error.response?.data.errores ||
          "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde"
      );
    }
  };

  const checkCedula = async (value) => {
    try {
      const token = getUserToken();
      setRequestToken(token);

      const responseData = await fetchRequest(
        `/users/auth/check_cedula/${value}`,
        "POST"
      );

      const { registrado } = responseData.data.data;

      if (registrado) {
        setError("cedula", {
          type: "manual",
          message:
            "La cedula ingresado ya se encuentra registrado en la base de datos.",
        });
      } else {
        clearErrors("cedula");
      }

      setDisableButton(registrado);
    } catch (error) {
      setError("cedula", {
        type: "manual",
        message:
          "Ocurrio un error interno consultando el número de cédula, intentalo de nuevo más tarde.",
      });
      setDisableButton(false);
    }
  };

  const handleCheckCedula = ({ target }) => {
    const value = target.value;

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      checkCedula(value);
    }, 500);
  };

  const checkEmail = async (value) => {
    try {
      const token = getUserToken();
      setRequestToken(token);

      const responseData = await fetchRequest(
        `/users/auth/check_email/${value}`,
        "POST"
      );

      const { registrado } = responseData.data.data;

      if (registrado) {
        setError("email", {
          type: "manual",
          message:
            "El email ingresado ya se encuentra registrado en la base de datos.",
        });
      } else {
        clearErrors("email");
      }

      setDisableButton(registrado);
    } catch (error) {
      setError("email", {
        type: "manual",
        message:
          "Ocurrio un error interno consultando el número de cédula, intentalo de nuevo más tarde.",
      });
      setDisableButton(false);
    }
  };

  const handleCheckEmail = ({ target }) => {
    const value = target.value;

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      checkEmail(value);
    }, 500);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <Fade in>
      <form onSubmit={handleSubmit(handleSubmitSecondForm)}>
        <Box mb={1}>
          <Typography color="textPrimary" variant="h4">
            Registro de usuario master
            <FormTextRequired />
          </Typography>
        </Box>

        <Controller
          name="cedula"
          defaultValue={undefined}
          control={control}
          render={({ ref, onChange, value }) => (
            <TextField
              fullWidth
              label="Cedula *"
              margin="normal"
              name="cedula"
              variant="outlined"
              value={value}
              autoComplete="off"
              onChange={(e) => {
                onChange(e);
                handleCheckCedula(e);
              }}
              inputProps={{
                className: classes.input,
              }}
              error={!!errors.cedula}
              helperText={errors.cedula ? errors.cedula.message : ""}
              inputRef={ref}
            />
          )}
        />

        <TextField
          fullWidth
          label="Nombre Completo *"
          margin="normal"
          name="nameUsers"
          variant="outlined"
          autoComplete="off"
          inputProps={{
            className: classes.input,
          }}
          error={!!errors.nameUsers}
          helperText={errors.nameUsers ? errors.nameUsers.message : ""}
          inputRef={register}
        />

        <Controller
          name="email"
          defaultValue={undefined}
          control={control}
          render={({ ref, onChange, value }) => (
            <TextField
              fullWidth
              label="Correo *"
              value={value}
              margin="normal"
              name="email"
              onChange={(e) => {
                onChange(e);
                handleCheckEmail(e);
              }}
              variant="outlined"
              type="email"
              autoComplete="off"
              inputProps={{
                className: classes.input,
              }}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
              inputRef={ref || register}
            />
          )}
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
            Continuar
          </Button>
        </div>
      </form>
    </Fade>
  );
};

export default RegisterForm;
