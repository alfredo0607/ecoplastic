import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

function FormInfoTelefonoUsuario({ classes, register, errors }) {
  return (
    <Grid item xs={12}>
      <Box mb={2}>
        <Card>
          <CardContent>
            <Box mb={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h4" color="textPrimary">
                  Información De Contacto
                </Typography>
              </Box>

              <Typography variant="caption" color="textSecondary">
                Los campos marcados con * son obligatorios de llenar
              </Typography>
            </Box>

            <TextField
              label="Tipo de numero *"
              type="text"
              autoComplete="off"
              placeholder="p.e.j: Celular personal, Contacto de emergencia"
              fullWidth
              variant="outlined"
              name="tipoNumero"
              inputRef={register}
              className={classes.inputBasic}
              error={!!errors.tipoNumero}
              helperText={errors.tipoNumero?.message || ""}
            />

            <TextField
              label="Número de telefono *"
              type="text"
              autoComplete="off"
              placeholder="123456789"
              fullWidth
              inputProps={{ minLength: 3 }}
              variant="outlined"
              name="numero"
              inputRef={register}
              className={classes.inputBasic}
              error={!!errors.numero}
              helperText={errors.numero?.message || ""}
            />
          </CardContent>
        </Card>
      </Box>
    </Grid>
  );
}

export default FormInfoTelefonoUsuario;
