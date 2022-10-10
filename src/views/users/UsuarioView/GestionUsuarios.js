import * as React from "react";

import {
  Typography,
  Button,
  Paper,
  Grid,
  ButtonGroup,
  useMediaQuery,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RegistrarUsuario from "./gestion/RegistrarUsuario";

const useStyles = makeStyles((theme) => ({
  titleText: {
    color:
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.7)"
        : "rgba(255, 255, 255, 0.9)",
  },
  input: {
    display: "none",
  },
}));

/* TODO: Arreglar el responsive de la barra superior de menu */

function GestionUsuarios({
  updateUsers,
  handleOpenModal,
  handleCloseModal,
  optionsModals,
}) {
  const classes = useStyles();
  const matches = useMediaQuery((theme) => theme.breakpoints.down("md"));

  return (
    <Grid item xs={12}>
      <Paper style={{ padding: "1em" }}>
        <Grid container direction="row" alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography className={classes.titleText} variant="h1">
              Usuarios
            </Typography>
          </Grid>

          <Grid item xs={12} md={6} container justifyContent="flex-end">
            <ButtonGroup
              color="secondary"
              aria-label="outlined secondary button group"
              orientation={matches ? "vertical" : "horizontal"}
              fullWidth={matches}
            >
              <Button
                startIcon={<PersonAddIcon />}
                onClick={() => handleOpenModal("register")}
              >
                Registrar Usuario
              </Button>

              <Button
                startIcon={<DescriptionIcon />}
                onClick={() => handleOpenModal("download")}
              >
                Generar Excel
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>

        {/* Modal Register new user */}

        <RegistrarUsuario
          updateUsers={updateUsers}
          open={optionsModals.register}
          onClose={() => handleCloseModal("register")}
        />

        {/* Modal upload users from Excel */}

        {/* <FormUploadUsersFromExcel
          open={optionsModals.upload}
          onClose={() => handleCloseModal("upload")}
        /> */}
      </Paper>
    </Grid>
  );
}

export default GestionUsuarios;
