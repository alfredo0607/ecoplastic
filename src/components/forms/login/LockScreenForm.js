import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link as RouterLink } from "react-router-dom";

import {
  Box,
  Typography,
  Avatar,
  Button,
  Grid,
  Link,
  Collapse,
  IconButton,
} from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import { Alert } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
// import { startLoginUser, clearError } from "src/redux/actions/authActions";
import InputPassword from "../common/InputPassword";
import DividerWithText from "../../utils/DividerWithText";
import LoadingForms from "../../LoadingForms";
import { clearError, startLoginUser } from "../../../redux/actions/authActions";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: "120px",
    height: "120px",
    border: "2px solid",
    borderColor: theme.palette.secondary.main,
  },
  icon: {
    color: theme.palette.primary.main,
    fontSize: "119px",
    backgroundColor: "white",
  },
}));

const schema = yup.object().shape({
  password: yup.string().required("La contraseña es requerida"),
});

const LockScreenForm = ({ setLockScreen, dataUser }) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const { errorAuth, fetchingData } = useSelector((state) => state.auth);

  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const handleClickLoginAnotherAccount = (e) => {
    e.preventDefault();
    dispatch(clearError());
    setLockScreen(false);
  };

  const handleSubmitLogin = ({ password }) => {
    if (fetchingData) return;

    dispatch(startLoginUser(dataUser.email, password));
  };

  const capitalizeFirstLetter = (string) => {
    if (string === "") return "";

    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleClearError = () => dispatch(clearError());

  return (
    <>
      {fetchingData && <LoadingForms />}

      <Box mb={3}>
        <Typography color="textPrimary" variant="h2" align="center">
          Bienvenid@ de vuelta,{" "}
          {capitalizeFirstLetter(dataUser.firstName || "")}!
        </Typography>
      </Box>

      <Box mb={1} display="flex" justifyContent="center">
        <Avatar
          alt={dataUser.firstName}
          src={`https://ecoplastic.herokuapp.com/uploads/images/imagenes_usuarios/${dataUser.avatar}`}
          className={classes.avatar}
        >
          <PersonRoundedIcon className={classes.icon} />
        </Avatar>
      </Box>

      <form onSubmit={handleSubmit(handleSubmitLogin)}>
        <InputPassword
          register={register}
          errors={errors}
          label="Contraseña"
          name="password"
        />

        <Grid container justifyContent="flex-end" alignItems="center">
          <Link component={RouterLink} to="/recovery" variant="h6">
            Olvide mi contraseña
          </Link>
        </Grid>

        {errorAuth && (
          <Box>
            <Collapse in={errorAuth}>
              <Alert
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={handleClearError}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                {errorAuth}
              </Alert>
            </Collapse>
          </Box>
        )}

        <Box my={2}>
          <Button
            fullWidth
            color="primary"
            size="medium"
            type="submit"
            variant="contained"
          >
            Ingresar
          </Button>
        </Box>

        <DividerWithText spacing={1}>
          <Typography variant="caption" style={{ color: "grey" }}>
            ¿No eres tú?
          </Typography>
        </DividerWithText>

        <Grid container justifyContent="center" alignItems="center">
          <Link href="#" onClick={handleClickLoginAnotherAccount} variant="h6">
            Iniciar sesión con otra cuenta
          </Link>
        </Grid>
      </form>
    </>
  );
};

export default LockScreenForm;
