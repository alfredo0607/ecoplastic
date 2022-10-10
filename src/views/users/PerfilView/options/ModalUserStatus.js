import * as React from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

import LoadingForms from "../../../../components/LoadingForms";
import { getUserToken, setUserToken } from "../../../../helpers/setGetToken";
import {
  fetchRequest,
  setRequestToken,
} from "../../../../helpers/fetchRequest";

const { useState } = React;

const ModalUserStatus = ({
  userStatus,
  idUser,
  setUserInfo,
  open,
  handleClose,
  setMessage,
}) => {
  const [sendingForm, setSendingForm] = useState(false);

  const handleChangeUserState = async () => {
    const newState = userStatus === 1 ? 0 : 1;

    setSendingForm(true);

    try {
      const token = getUserToken();
      setRequestToken(token);

      const {
        data: { data },
      } = await fetchRequest(
        `/users/actualizar_estado_usuario/${idUser}`,
        "PUT",
        { newState }
      );

      handleClose();
      setMessage({ type: "success", message: data.message });
      setUserInfo((prevState) => ({
        ...prevState,
        usersDetails: { ...prevState.usersDetails, estadoUsuario: newState },
      }));
    } catch (error) {
      let errorMsg = "";

      if (error.response?.status === 422) {
        errorMsg = error.response.data.error;
      } else {
        errorMsg =
          "Ocurrio un error interno en el servidor, por favor intentalo de nuevo más tarde. CODIGO: " +
          error.response.status;
      }

      setMessage({ type: "error", message: errorMsg });
    } finally {
      setSendingForm(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {sendingForm && <LoadingForms />}

        <DialogTitle id="alert-dialog-title">
          {userStatus === 1
            ? "¿Bloquear el usuario seleccionado?"
            : "¿Activar el usuario seleccionado?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {userStatus === 1
              ? "Los usuarios bloqueados no pueden ingresar a la plataforma de ningun de modo. Asegurate de que el usuario no sea un trabajador activo de la empresa"
              : "Asegurate de reactivar al usuario solo si este se encuentra activo como trabajador de la empresa"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleChangeUserState} color="primary" autoFocus>
            Continuar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalUserStatus;
