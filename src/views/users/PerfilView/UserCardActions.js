import * as React from "react";

import { useSelector } from "react-redux";

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  CircularProgress,
  Typography,
  Box,
  Dialog,
} from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import { Alert } from "@mui/material";

import KeyIcon from "mdi-material-ui/AccountKey";
import FileExcelIcon from "mdi-material-ui/FileExcelBox";
import CancelIcon from "mdi-material-ui/Cancel";
import CheckBoldIcon from "mdi-material-ui/CheckBold";
import CogIcon from "mdi-material-ui/Cog";
import ImageAlbumIcon from "mdi-material-ui/Image";
import DomainIcon from "mdi-material-ui/Briefcase";

import ModalUserResetPassword from "./options/ModalUserResetPassword";

import { getUserToken } from "../../../helpers/setGetToken";
import { fetchRequest, setRequestToken } from "../../../helpers/fetchRequest";
import ModalUserStatus from "./options/ModalUserStatus";

const useStyles = makeStyles((theme) => ({
  excel: {
    color: theme.palette.success.main,
  },
}));

const { useState } = React;

const UserCardActions = ({ idUser, userInfo, setUserInfo }) => {
  const classes = useStyles();

  const [formsDialogOptions, setFormsDialogOptions] = useState({
    formPermisos: false,
    formImage: false,
    formClient: false,
    formStatus: false,
    formPassword: false,
    formExcel: false,
  });

  const [message, setMessage] = useState({ type: null, message: null });

  const handleCloseFormDialog = (key) => {
    setFormsDialogOptions((prevState) => ({
      ...prevState,
      [key]: false,
    }));
  };

  const handleOpenFormDialog = (key) => {
    setFormsDialogOptions((prevState) => ({
      ...prevState,
      [key]: true,
    }));
  };

  const handleCloseSnackbar = () => setMessage({ type: null, message: null });

  return (
    <>
      <List component="nav" aria-label="Acciones perfil del usuario">
        <ListItem
          button
          onClick={() => handleOpenFormDialog("formStatus")}
          // disabled={userHasPermissions.status}
        >
          <ListItemIcon>
            {userInfo?.estadoUsuario === 0 ? (
              <CheckBoldIcon className={classes.excel} />
            ) : (
              <CancelIcon color="error" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={
              userInfo?.estadoUsuario === 0
                ? "Activar Usuario"
                : "Bloquear Usuario"
            }
          />
        </ListItem>
      </List>

      {/* Messages */}
      <Snackbar
        open={!!message.message}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={message.type || "success"}
        >
          {message.message || ""}
        </Alert>
      </Snackbar>

      <ModalUserStatus
        userStatus={userInfo?.estadoUsuario}
        idUser={idUser}
        setUserInfo={setUserInfo}
        open={formsDialogOptions.formStatus}
        handleClose={() => handleCloseFormDialog("formStatus")}
        setMessage={setMessage}
      />

      <ModalUserResetPassword
        idUser={idUser}
        // isRegistered={userInfo.estaRegistrado}
        open={formsDialogOptions.formPassword}
        handleClose={() => handleCloseFormDialog("formPassword")}
        setMessage={setMessage}
      />
    </>
  );
};

export default UserCardActions;
