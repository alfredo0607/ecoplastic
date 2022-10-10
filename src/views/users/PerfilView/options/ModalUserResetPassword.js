import * as React from "react";

import { CopyToClipboard } from "react-copy-to-clipboard";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  Typography,
  IconButton,
} from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import { Alert } from "@mui/material";

import ContentCopyIcon from "mdi-material-ui/ContentCopy";
import { getUserToken } from "../../../../helpers/setGetToken";
import {
  fetchRequest,
  setRequestToken,
} from "../../../../helpers/fetchRequest";

const useStyles = makeStyles((theme) => ({
  passwordContainer: {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.06)",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    marginTop: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(1),
  },
}));

const { useState } = React;

const ModalUserResetPassword = ({
  idUser,
  isRegistered,
  open,
  handleClose,
  setMessage,
}) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [passwordGenerated, setPasswordGenerated] = useState(null);

  const handleGenerateNewPassword = async () => {
    setLoading(true);

    try {
      const token = getUserToken();
      setRequestToken(token);

      const response = await fetchRequest(
        `/users/auth/generar_clave/${idUser}`
      );
      const { message, newPassword } = response.data.data;

      setPasswordGenerated(newPassword);
      setMessage({
        type: "success",
        message,
      });
    } catch (error) {
      const errMsg =
        error.response?.status === 422
          ? error.response.data.errores
          : "Ocurrio un error inesperado, por favor vuelve a intentarlo de nuevo más tarde";

      setMessage({
        type: "error",
        message: errMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeMessageCopy = () => {
    setMessage({
      type: "info",
      message: "Copiado!",
    });
  };

  const handleCloseDialog = () => {
    setPasswordGenerated(null);
    handleClose();
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="xs"
        aria-labelledby="change-password-title-dialog"
        open={open}
        onClose={handleCloseDialog}
        disableEscapeKeyDown={loading}
      >
        <DialogTitle id="change-password-title-dialog">
          Generar nueva contraseña
        </DialogTitle>
        <DialogContent>
          {isRegistered === 0 && (
            <Box mb={1}>
              <Alert severity="info">El usuario aún no se ha registrado</Alert>
            </Box>
          )}

          <Button
            fullWidth
            variant="outlined"
            onClick={handleGenerateNewPassword}
            disabled={isRegistered === 0}
          >
            Generar Contraseña
          </Button>

          {passwordGenerated && (
            <Box className={classes.passwordContainer}>
              <Typography variant="h4">{passwordGenerated}</Typography>

              <CopyToClipboard
                text={passwordGenerated}
                onCopy={handleChangeMessageCopy}
              >
                <IconButton onClick={(e) => e.stopPropagation()} size="small">
                  <ContentCopyIcon />
                </IconButton>
              </CopyToClipboard>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalUserResetPassword;
