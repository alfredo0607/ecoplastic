import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Box,
  Button,
  Link,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Grid,
  Collapse,
  IconButton,
} from "@mui/material";

import { Alert } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import DividerWithText from "../../utils/DividerWithText";
import InputPassword from "../common/InputPassword";
import LoadingForms from "../../LoadingForms";
import { clearError, startLoginUser } from "../../../redux/actions/authActions";

const schema = yup.object().shape({
  email: yup.string().required("El correo es requerido"),
  password: yup.string().required("La contraseña es requerida"),
});

const LoginHomeForm = () => {
  const [remember, setRemember] = useState(false);

  const rememberCheck = useRef(null);
  const dispatch = useDispatch();

  const { errorAuth, fetchingData } = useSelector((state) => state.auth);

  const { register, handleSubmit, errors, getValues, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { cedula: "" },
  });

  const handleSubmitLogin = (data) =>
    dispatch(startLoginUser(data.email, data.password));

  const handleChangeRemember = () => {
    if (rememberCheck.current.checked) {
      if (getValues("email") !== "") {
        localStorage.setItem("rememberUser", getValues("email"));
        setRemember(rememberCheck.current.checked);
      }
    } else {
      localStorage.removeItem("rememberUser");
      setRemember(false);
    }
  };

  const handleClearError = () => dispatch(clearError());

  useEffect(() => {
    setValue("email", "");

    const cedulaStorage = localStorage.getItem("rememberUser") || false;

    if (cedulaStorage) {
      setValue("email", cedulaStorage);
    }

    setRemember(!!cedulaStorage);

    return () => handleClearError();
  }, [setRemember, setValue]);

  return (
    <>
      {fetchingData && <LoadingForms />}
    
      <Box mb={3}>
        <Typography color="textPrimary" variant="h2">
          Iniciar Sesión
        </Typography>

        <Typography color="textSecondary" gutterBottom variant="body2">
          Inicia sesión en EcoPlastic
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(handleSubmitLogin)}>
        <TextField
          fullWidth
          label="Correo *"
          placeholder="Correo"
          margin="normal"
          name="email"
          type="email"
          InputLabelProps={{ shrink: true }}
          error={!!errors.email}
          variant="outlined"
          inputRef={register({ required: true })}
          helperText={errors.email ? errors.email.message : ""}
        />

        <InputPassword
          register={register}
          errors={errors}
          label="Contraseña"
          name="password"
        />

        <Grid container justifyContent="space-between" alignItems="center">
          <FormControlLabel
            control={
              <Checkbox
                checked={remember}
                onChange={handleChangeRemember}
                inputRef={rememberCheck}
                name="rememberCheck"
                color="primary"
              />
            }
            label={<Typography color="textPrimary">Recuerdame</Typography>}
          />

          <Link component={RouterLink} to="/recovery" variant="h6">
            Olvide mi contraseña
          </Link>
        </Grid>

        {errorAuth && (
          <Box>
            <Collapse in={errorAuth}>
              <Alert
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={handleClearError}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                {errorAuth}
              </Alert>
            </Collapse>
          </Box>
        )}

        <Box my={2}>
          <Button
            disabled={fetchingData}
            fullWidth
            color="primary"
            size="medium"
            type="submit"
            variant="contained"
          >
            Ingresar
          </Button>
        </Box>
      </form>

      <DividerWithText spacing={1}>
        <Typography variant="caption" style={{ color: "grey" }}>
          ¿No tienes una cuenta?
        </Typography>
      </DividerWithText>

      <Box my={2}>
        <RouterLink to="/register-users">
          <Button fullWidth size="medium" variant="outlined">
            Registro De Usuario
          </Button>
        </RouterLink>
      </Box>

      <Box my={2}>
        <RouterLink to="/register-business">
          <Button fullWidth size="medium" variant="outlined">
            Registro De Empresa
          </Button>
        </RouterLink>
      </Box>
    </>
  );
};

export default LoginHomeForm;
