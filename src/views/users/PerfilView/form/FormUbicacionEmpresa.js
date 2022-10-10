import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
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
import makeStyles from "@mui/styles/makeStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { infoBasicaValidations } from "../../../../validations/registroUsuarioValidations";

const schema = yup.object().shape({ ...infoBasicaValidations });

const useStyles = makeStyles((theme) => ({
  inputBasic: {
    marginBottom: "12px",
  },
  labelFixed: {
    backgroundColor:
      theme.palette.mode !== "light" ? theme.palette.background.paper : "white",
  },
}));

export default function FormUbicacionEmpresa({
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
  return (
    <Grid item xs={12}>
      <Box mb={2}>
        <Card>
          <CardContent>
            <Box mb={2}>
              <Typography variant="h4" color="textPrimary">
                Ubicacion de la empresa
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

            <TextField
              label="Direccion *"
              type="text"
              autoComplete="off"
              name="direccione"
              spellCheck={false}
              helperText={errors.direccione?.message || ""}
              placeholder="Ingrese su direccion"
              error={!!errors.direccione}
              inputRef={register()}
              fullWidth
              variant="outlined"
              //   disabled={disableAll}
              className={classes.inputBasic}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Pais *"
              type="text"
              autoComplete="off"
              name="paise"
              spellCheck={false}
              helperText={errors.paise?.message || ""}
              placeholder="Ingrese su pais"
              error={!!errors.paise}
              inputRef={register()}
              fullWidth
              variant="outlined"
              //   disabled={disableAll}
              className={classes.inputBasic}
              InputLabelProps={{ shrink: true }}
            />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Ciudad *"
                  type="text"
                  autoComplete="off"
                  name="ciudade"
                  spellCheck={false}
                  helperText={errors.ciudade?.message || ""}
                  placeholder="Ingrese su ciudad"
                  error={!!errors.ciudade}
                  inputRef={register()}
                  fullWidth
                  variant="outlined"
                  //   disabled={disableAll}
                  className={classes.inputBasic}
                  InputLabelProps={{ shrink: true }}
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
                  name="phonee"
                  inputRef={register}
                  className={classes.inputBasic}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.phonee}
                  helperText={errors.phonee?.message || ""}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Grid>
  );
}
