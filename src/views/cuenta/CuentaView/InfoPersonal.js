import "date-fns";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import clsx from "clsx";
import moment from "moment";
import {
  Container,
  Grid,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  TextField,
  CardHeader,
  Collapse,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Alert, AlertTitle } from "@mui/material";
import LoadingForms from "../../../components/LoadingForms";
import useFileUpload from "../../../hooks/useFileUpload.js";
import {
  updateUserImage,
  updateUsersDetails,
} from "../../../redux/actions/authActions";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const generoList = [
  {
    value: "Femenino",
    label: "Femenino",
  },
  {
    value: "Masculino",
    label: "Masculino",
  },
  {
    value: "Otro",
    label: "Otro",
  },
];

const schema = yup.object().shape({
  cedula: yup.string().required("La cedula es requerido"),
  nombre: yup.string().required("El nombre es requerida"),
  genero: yup.string().required("El genero es requerida"),
  email: yup.string().required("El email es requerida"),
  phone: yup.string().required("El celular es requerida"),
  fecha_nacimiento: yup.string().required("La fecha_nacimiento es requerida"),
  ciudad: yup.string().required("La ciudad es requerida"),
  localida: yup.string().required("La localida es requerida"),
  barrio: yup.string().required("La barrio es requerida"),
  direccion: yup.string().required("La direccion es requerida"),
});

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  avatar: {
    height: 100,
    width: 100,
  },
  userName: {
    width: "70%",
    whiteSpace: "normal",
    textAlign: "center",
    marginTop: 10,
  },
  dateText: {
    backgroundColor: theme.palette.background.default,
    borderRadius: 10,
    position: "absolute",
    top: 10,
    left: 10,
    fontSize: 12,
    paddingRight: 6,
    paddingLeft: 6,
  },
}));

const InfoPersonal = ({ className, userDetail, setExcelMessages, ...rest }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const { register, handleSubmit, errors, control, getValues, setValue } =
    useForm({
      resolver: yupResolver(schema),
      defaultValues: {
        cedula: userDetail?.usersDetails?.cedula
          ? userDetail?.usersDetails?.cedula
          : "",
        nombre: userDetail?.usersDetails.nombre
          ? userDetail?.usersDetails.nombre
          : "",
        genero: userDetail?.usersDetails?.genero
          ? userDetail?.usersDetails?.genero
          : "Masculino",
        email: userDetail?.usersDetails.email
          ? userDetail?.usersDetails.email
          : "",
        phone: userDetail?.usersDetails?.phone
          ? userDetail?.usersDetails?.phone
          : "",
        fecha_nacimiento: userDetail?.usersDetails.fecha_nacimiento
          ? userDetail?.usersDetails.fecha_nacimiento
          : "",
        ciudad: userDetail?.usersDetails.ciudad
          ? userDetail?.usersDetails.ciudad
          : "",
        localida: userDetail?.usersDetails.localida
          ? userDetail?.usersDetails.localida
          : "",
        barrio: userDetail?.usersDetails.barrio
          ? userDetail?.usersDetails.barrio
          : "",
        direccion: userDetail?.usersDetails.direccion
          ? userDetail?.usersDetails.direccion
          : "",
        adicionales: userDetail?.usersDetails.adicionales
          ? userDetail?.usersDetails.adicionales
          : "",
      },
    });

  const { user } = useSelector((state) => state.auth);

  const { uploadFiles, progressUpload, responseUpload, errorUploading } =
    useFileUpload();

  const handleUploadFile = ({ target }) => {
    if (target.files.length === 0) return;

    let formData = new FormData();
    formData.append("archivo", target.files[0]);

    uploadFiles(
      `users/subir_foto_usuario/perfil/${user?.usuario?.idUsuario}`,
      formData,
      (data) => {
        console.log(data.nombreArchivo);
        dispatch(updateUserImage(data.nombreArchivo));
      }
    );

    target.value = null;
  };

  const onSutmitUpdateUsers = (data) => {
    try {
      console.log(data);
      dispatch(updateUsersDetails(data, user?.usuario?.idUsuario));

      setExcelMessages({
        type: "success",
        message: "Registros actualizados con exito",
        where: "nuevaVista",
      });
    } catch (error) {
      setExcelMessages({
        type: "error",
        message: "Hubo un error al actualizar los registros",
        where: "nuevaVista",
      });
    }
  };

  return (
    <Container maxWidth={false}>
      <Grid container spacing={3} justifyContent="space-between">
        <Grid item lg={4} md={6} xs={12}>
          <Card className={clsx(classes.root, className)} {...rest}>
            {progressUpload > 0 && <LoadingForms value={progressUpload} />}
            <CardContent>
              <Box alignItems="center" display="flex" flexDirection="column">
                <Avatar
                  className={classes.avatar}
                  src={`http://localhost:3006/uploads/images/imagenes_usuarios/${user.usuario.imagenUsuario}`}
                  // src={user.usuario.nombre}
                />
                <Typography
                  color="textPrimary"
                  gutterBottom
                  variant="h3"
                  className={classes.userName}
                >
                  {userDetail?.usersDetails.nombre}
                </Typography>
                <Typography color="textSecondary" variant="body1">
                  {`${userDetail?.usersDetails.ciudad} - Colombia`}
                </Typography>

                <Typography color="textSecondary" variant="body1">
                  C.C. {`${userDetail?.usersDetails.cedula}`}
                </Typography>
                <Typography color="textSecondary" variant="body1">
                  {`${
                    userDetail?.usersDetails?.name_rol === "Admin"
                      ? "ADMINISTRADOR"
                      : "OPERARIO"
                  }`}
                </Typography>

                <Divider />

                <Typography
                  className={classes.dateText}
                  color="textSecondary"
                  variant="body1"
                >
                  {/* {`${moment().format("hh:mm A")} ${usuario.timezone}`} */}
                </Typography>
              </Box>
            </CardContent>

            <Divider />

            <CardActions>
              <Box width="100%">
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="fileUserImage"
                  type="file"
                  onChange={handleUploadFile}
                />
                <label htmlFor="fileUserImage">
                  <Button
                    color="primary"
                    fullWidth
                    variant="contained"
                    component="span"
                  >
                    Subir Imagen de Perfil
                  </Button>
                </label>
              </Box>
            </CardActions>

            <Collapse in={!!responseUpload}>
              <Alert severity="success">
                <AlertTitle>Exito</AlertTitle>
                {"La imagen se subio correctamente."}
              </Alert>
            </Collapse>

            <Collapse in={!!errorUploading}>
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {errorUploading}
              </Alert>
            </Collapse>
          </Card>
        </Grid>
        <Grid item lg={8} md={6} xs={12}>
          <form
            autoComplete="off"
            className={clsx(classes.root, className)}
            // {...rest}
            onSubmit={handleSubmit(onSutmitUpdateUsers)}
          >
            <Card>
              <CardHeader
                subheader="Esta informacion puede ser modificada *"
                title="Perfil"
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="cedula *"
                      placeholder="cedula"
                      margin="normal"
                      name="cedula"
                      type="text"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.cedula}
                      variant="outlined"
                      inputRef={register({ required: true })}
                      helperText={errors.cedula ? errors.cedula.message : ""}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Nombre *"
                      placeholder="nombre"
                      margin="normal"
                      name="nombre"
                      type="text"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.nombre}
                      variant="outlined"
                      inputRef={register({ required: true })}
                      helperText={errors.nombre ? errors.nombre.message : ""}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Seleccione su genero *"
                      placeholder="genero"
                      margin="normal"
                      name="genero"
                      type="text"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.genero}
                      variant="outlined"
                      inputRef={register({ required: true })}
                      helperText={errors.genero ? errors.genero.message : ""}
                    >
                      {generoList.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Ingrese su correo *"
                      placeholder="email"
                      margin="normal"
                      name="email"
                      type="email"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.email}
                      variant="outlined"
                      inputRef={register({ required: true })}
                      helperText={errors.email ? errors.email.message : ""}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Celular *"
                      placeholder="Ingrese su celular"
                      margin="normal"
                      name="phone"
                      type="text"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.phone}
                      variant="outlined"
                      inputRef={register({ required: true })}
                      helperText={errors.phone ? errors.phone.message : ""}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <Controller
                      name="fecha_nacimiento"
                      control={control}
                      defaultValue={new Date()}
                      render={({ onChange, value, ref }) => (
                        <>
                          <DatePicker
                            error={!!errors.fecha_nacimiento}
                            fullWidth
                            inputVariant="outlined"
                            disableFuture
                            format="DD/MM/YYYY"
                            label="Fecha de nacimiento"
                            inputRef={ref}
                            views={["day", "month", "year"]}
                            value={value}
                            onChange={onChange}
                            // disabled={disableAll}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </>
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <CardHeader
                subheader="Esta información puede ser modificada y actualizada *"
                title="Informacion residencial"
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Ciudad donde vive *"
                      placeholder="Ingrese su ciudad"
                      margin="normal"
                      name="ciudad"
                      type="text"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.ciudad}
                      variant="outlined"
                      inputRef={register({ required: true })}
                      helperText={errors.ciudad ? errors.ciudad.message : ""}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Barrio donde vive *"
                      placeholder="Ingrese su barrio"
                      margin="normal"
                      name="barrio"
                      type="text"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.barrio}
                      variant="outlined"
                      inputRef={register({ required: true })}
                      helperText={errors.barrio ? errors.barrio.message : ""}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Direccion donde vive *"
                      placeholder="Ingrese su direccion"
                      margin="normal"
                      name="direccion"
                      type="text"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.direccion}
                      variant="outlined"
                      inputRef={register({ required: true })}
                      helperText={
                        errors.direccion ? errors.direccion.message : ""
                      }
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Localidad donde vives *"
                      placeholder="Localidad donde vives"
                      margin="normal"
                      name="localida"
                      type="text"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.localida}
                      variant="outlined"
                      inputRef={register({ required: true })}
                      helperText={
                        errors.localida ? errors.localida.message : ""
                      }
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Informacion adicional *"
                      placeholder="Casa/Apto/bloque"
                      margin="normal"
                      name="adicionales"
                      type="text"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.adicionales}
                      variant="outlined"
                      inputRef={register({ required: true })}
                      helperText={
                        errors.adicionales ? errors.adicionales.message : ""
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Box display="flex" justifyContent="flex-end" p={2}>
                <Button type="submit" color="secondary" variant="contained">
                  Guardar Cambios
                </Button>
              </Box>
            </Card>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

InfoPersonal.propTypes = {
  className: PropTypes.string,
  userDetail: PropTypes.any,
  setExcelMessages: PropTypes.any,
};

export default InfoPersonal;
