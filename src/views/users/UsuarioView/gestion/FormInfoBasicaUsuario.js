import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { getUserToken } from "../../../../helpers/setGetToken";
import {
  fetchRequest,
  setRequestToken,
} from "../../../../helpers/fetchRequest";

function FormInfoBasicaUsuario({
  control,
  classes,
  register,
  errors,
  setError,
  clearErrors,
  setDisableButton,
  disableAll = false,
  loading = false,
}) {
  const timeoutRef = useRef(null);

  const [searchingCedula, setSearchingCedula] = useState(false);

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
    <Grid item xs={12}>
      <Box mb={2}>
        <Card>
          <CardContent>
            <Box mb={2}>
              <Typography variant="h4" color="textPrimary">
                Información Básica
                {loading && (
                  <CircularProgress
                    color="secondary"
                    size={14}
                    style={{ marginLeft: "5px" }}
                  />
                )}
              </Typography>

              <Typography variant="caption" color="textSecondary">
                Los campos marcados con * son obligatorios de llenar
              </Typography>
            </Box>

            <Controller
              name="cedula"
              defaultValue={undefined}
              control={control}
              render={({ ref, onChange, value }) => (
                <TextField
                  label="Número de documento *"
                  type="number"
                  autoComplete="off"
                  name="cedula"
                  helperText={errors.cedula?.message || ""}
                  placeholder="Número de documento"
                  inputRef={ref}
                  onChange={(e) => {
                    onChange(e);
                    handleCheckCedula(e);
                  }}
                  value={value}
                  defaultValue={undefined}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={disableAll}
                  error={!!errors.cedula}
                  variant="outlined"
                  className={classes.inputBasic}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {searchingCedula && <CircularProgress size={20} />}
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <TextField
              label="Nombre Completo *"
              type="text"
              autoComplete="off"
              name="nombre"
              spellCheck={false}
              helperText={errors.nombre?.message || ""}
              placeholder="Nombre completo"
              error={!!errors.nombre}
              inputRef={register()}
              fullWidth
              variant="outlined"
              disabled={disableAll}
              className={classes.inputBasic}
              InputLabelProps={{ shrink: true }}
            />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="email"
                  defaultValue={undefined}
                  control={control}
                  render={({ ref, onChange, value }) => (
                    <TextField
                      label="Correo *"
                      type="email"
                      autoComplete="off"
                      name="email"
                      helperText={errors.email?.message || ""}
                      placeholder="Correo electronico"
                      inputRef={ref}
                      onChange={(e) => {
                        onChange(e);
                        handleCheckEmail(e);
                      }}
                      value={value}
                      defaultValue={undefined}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      disabled={disableAll}
                      error={!!errors.email}
                      variant="outlined"
                      className={classes.inputBasic}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {searchingCedula && <CircularProgress size={20} />}
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Número de telefono *"
                  type="text"
                  autoComplete="off"
                  placeholder="123456789"
                  fullWidth
                  inputProps={{ minLength: 3 }}
                  variant="outlined"
                  name="phone"
                  inputRef={register}
                  className={classes.inputBasic}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.phone}
                  helperText={errors.phone?.message || ""}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="genero"
                  control={control}
                  defaultValue=""
                  render={({ onChange, value, ref }) => (
                    <FormControl
                      className={classes.inputBasic}
                      fullWidth
                      error={!!errors.genero}
                      variant="outlined"
                    >
                      <InputLabel
                        className={classes.labelFixed}
                        id="label-genero-usuario"
                        shrink
                      >
                        Genero *
                      </InputLabel>
                      <Select
                        labelId="label-genero-usuario"
                        inputRef={ref}
                        defaultValue=""
                        displayEmpty
                        value={value}
                        disabled={disableAll}
                        onChange={(event) => onChange(event.target.value)}
                      >
                        <MenuItem value="" disabled selected>
                          Selecciona una opción
                        </MenuItem>
                        <MenuItem value="Femenino">Femenino</MenuItem>
                        <MenuItem value="Masculino">Masculino</MenuItem>
                        <MenuItem value="Otro">Otro</MenuItem>
                      </Select>
                      {!!errors.genero && (
                        <FormHelperText>
                          {errors.genero?.message || ""}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="fecha_nacimiento"
                  control={control}
                  defaultValue={new Date()}
                  render={({ onChange, value, ref }) => (
                    <>
                      <DatePicker
                        error={!!errors.fecha_nacimiento}
                        className={classes.inputBasic}
                        fullWidth
                        inputVariant="outlined"
                        disableFuture
                        format="DD/MM/YYYY"
                        label="Fecha de nacimiento"
                        inputRef={ref}
                        views={["day", "month", "year"]}
                        value={value}
                        onChange={onChange}
                        disabled={disableAll}
                        renderInput={(params) => <TextField {...params} />}
                      />
                      {!!errors.fecha_nacimiento && (
                        <FormHelperText>
                          {errors.fecha_nacimiento?.message || ""}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Grid>
  );
}

export default FormInfoBasicaUsuario;
