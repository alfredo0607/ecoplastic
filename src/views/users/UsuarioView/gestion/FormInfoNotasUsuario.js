import React from "react";

import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

function FormInfoNotasUsuario({ register, classes }) {
  return (
    <Grid item xs={12}>
      <Box mb={2}>
        <Card>
          <CardContent>
            <Box mb={2}>
              <Typography variant="h4" color="textPrimary">
                Notas Adicionales
              </Typography>

              <Typography variant="caption" color="textSecondary">
                En este apartado puedes agregar notas al usuario que se esta
                creando para indicar información adicional, como por ejemplo la
                actualización de un dato, datos faltante u observaciones.
              </Typography>
            </Box>

            <TextField
              label="Nueva nota"
              type="text"
              multiline
              maxRows={4}
              rows={2}
              autoComplete="off"
              name="nota"
              placeholder="Escribe la nota aqui"
              inputRef={register()}
              fullWidth
              variant="outlined"
              className={classes.inputBasic}
            />
          </CardContent>
        </Card>
      </Box>
    </Grid>
  );
}

export default FormInfoNotasUsuario;
