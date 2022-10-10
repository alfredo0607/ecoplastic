import * as React from "react";

import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
} from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";
import { Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import LoadingForms from "../../../../components/LoadingForms";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2),
    borderRadius: 5,
    border: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(1),
    "&:last-child": {
      marginBottom: 0,
    },
  },
}));

const { useState } = React;

const CardContactUser = ({
  id,
  tipo,
  numero,
  idUser,
  disableForm = false,
  setTotalContacts,
  setContacts,
}) => {
  const classes = useStyles();

  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
  const [sendingForm, setSendingForm] = useState(false);
  const [messageResponse, setMessageResponse] = useState(null);

  const handleCloseDialogConfirm = () => setOpenDialogConfirm(false);

  const handleOpenDialogConfirm = () => {
    if (disableForm) return;

    setOpenDialogConfirm(true);
  };

  const handleCloseSnackbar = () => setMessageResponse(null);

  //   const handleDeleteContact = async () => {
  //     setSendingForm(true);

  //     try {
  //       const token = getUserToken();
  //       setRequestToken(token);

  //       const response = await fetchRequest(
  //         `/users/eliminar_telefono_usuario/${id}/${idUser}`,
  //         "DELETE",
  //         {}
  //       );

  //       const { message } = response.data.data;

  //       setMessageResponse({ type: "success", message: message });

  //       handleCloseDialogConfirm();
  //       setTotalContacts((total) => total - 1);
  //       setContacts((contacts) =>
  //         contacts.filter((contact) => contact.idRegistro !== id)
  //       );
  //     } catch (error) {
  //       let msg =
  //         "Ocurrio un error interno, por favor intentalo de nuevo más tarde";

  //       if (error.response?.status === 422) {
  //         msg = error.response.data.errores;
  //       }

  //       setMessageResponse({ type: "error", message: msg });
  //     } finally {
  //       setSendingForm(false);
  //     }
  //   };

  return (
    <>
      <Snackbar
        open={!!messageResponse}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={messageResponse?.type || "success"}
        >
          {messageResponse?.message}
        </Alert>
      </Snackbar>

      <Box className={classes.root}>
        {sendingForm && <LoadingForms />}

        <Typography variant="h6">#{id}</Typography>

        <Box ml={2}>
          <Typography variant="body1">
            {tipo}: {numero}
          </Typography>
        </Box>

        <Box ml="auto">
          <IconButton
            disabled={disableForm}
            size="small"
            onClick={handleOpenDialogConfirm}
          >
            <DeleteIcon color={disableForm ? "disabled" : "error"} />
          </IconButton>
        </Box>
      </Box>

      <Dialog
        open={openDialogConfirm}
        onClose={handleCloseDialogConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`¿Eliminar el registro de contacto: ${numero}?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Eliminaras el número de contacto registrado, asegurate de eliminar
            el registro correcto.
          </DialogContentText>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleCloseDialogConfirm} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteContact} color="primary" autoFocus>
            Eliminar
          </Button>
        </DialogActions> */}
      </Dialog>
    </>
  );
};

export default CardContactUser;
