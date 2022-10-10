import React from "react";

import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

function FormInfoDireccionUsuario({
  classes,
  register,
  errors,
  loading = false,
  disableAll = false,
  type = "users",
}) {
  return (
    <Grid item xs={12}>
      <Box mb={2}>
        <Card>
          <CardContent>
            <Box mb={2}>
              <Typography variant="h4" color="textPrimary">
                {type === "users"
                  ? "Información De Ubicación"
                  : "Ubicación del master"}

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
              label="Ciudad de residencia *"
              type="text"
              autoComplete="off"
              name="ciudad"
              placeholder="Cuidad de residencia"
              error={!!errors.ciudad}
              helperText={errors.ciudad?.message || ""}
              inputRef={register()}
              fullWidth
              variant="outlined"
              className={classes.inputBasic}
              disabled={disableAll}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Localidad *"
              type="text"
              autoComplete="off"
              name="localida"
              placeholder="localida"
              error={!!errors.localida}
              helperText={errors.localida?.message || ""}
              inputRef={register()}
              fullWidth
              variant="outlined"
              className={classes.inputBasic}
              disabled={disableAll}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Barrio *"
              type="text"
              autoComplete="off"
              name="barrio"
              placeholder="Nombre del barrio"
              error={!!errors.barrio}
              helperText={errors.barrio?.message || ""}
              inputRef={register()}
              fullWidth
              variant="outlined"
              className={classes.inputBasic}
              disabled={disableAll}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Direccion"
              type="text"
              autoComplete="off"
              name="direccion"
              error={!!errors.direccion}
              placeholder="Direccion de residencia (Opcional)"
              inputRef={register()}
              fullWidth
              helperText={errors.direccion?.message || ""}
              variant="outlined"
              className={classes.inputBasic}
              disabled={disableAll}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Adicionales"
              type="text"
              autoComplete="off"
              name="adicionales"
              placeholder="Número de casa, piso, número de apto, etc (Opcional)"
              inputRef={register()}
              fullWidth
              variant="outlined"
              className={classes.inputBasic}
              disabled={disableAll}
              InputLabelProps={{ shrink: true }}
            />
          </CardContent>
        </Card>
      </Box>
    </Grid>
  );
}

export default FormInfoDireccionUsuario;
