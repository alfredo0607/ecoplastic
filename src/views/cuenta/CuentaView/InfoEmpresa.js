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
  updateBusinessDetails,
  updateEmpresaImage,
  updateUserImage,
  updateUsersDetails,
} from "../../../redux/actions/authActions";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  nit: yup.string().required("El nit es requerido"),
  nombre: yup.string().required("El nombre es requerida"),
  email: yup.string().required("El email es requerida"),
  phone: yup.string().required("El celular es requerida"),
  ciudad: yup.string().required("La ciudad es requerida"),
  pais: yup.string().required("La localida es requerida"),
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

const InfoEmpresa = ({ className, business, setExcelMessages, ...rest }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nit: business?.nit ? business?.nit : "",
      nombre: business?.nombre_empresa ? business?.nombre_empresa : "",
      email: business?.email ? business?.email : "",
      phone: business?.telefono ? business?.telefono : "",
      ciudad: business?.ciudad ? business?.ciudad : "",
      pais: business?.pais ? business?.pais : "",
      barrio: business?.barrio ? business?.barrio : "",
      direccion: business?.direccion ? business?.direccion : "",
    },
  });

  // console.log(business?.usersDetails);

  const { user } = useSelector((state) => state.auth);

  const { uploadFiles, progressUpload, responseUpload, errorUploading } =
    useFileUpload();

  const handleUploadFile = ({ target }) => {
    if (target.files.length === 0) return;

    let formData = new FormData();
    formData.append("archivo", target.files[0]);

    uploadFiles(
      `users/subir_foto_usuario/empresarial/${user?.usuario?.empresa?.idempresa}`,
      formData,
      (data) => {
        console.log(data.nombreArchivo);
        dispatch(updateEmpresaImage(data.nombreArchivo));
      }
    );

    target.value = null;
  };

  const onSutmitUpdateUsers = (data) => {
    try {
      const dataimg = {
        ...data,
        imageUrl: business.imageUrl,
        nombre_empresa: data.nombre,
      };

      dispatch(
        updateBusinessDetails(
          dataimg,
          user?.usuario?.idUsuario,
          user?.usuario?.empresa?.idempresa
        )
      );

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
                  src={`http://localhost:3006/uploads/images/corporativas/${business.imageUrl}`}
                  // src={user.usuario.nombre}
                />
                <Typography
                  color="textPrimary"
                  gutterBottom
                  variant="h3"
                  className={classes.userName}
                >
                  {business?.nombre_empresa}
                </Typography>
                <Typography color="textSecondary" variant="body1">
                  {`${business?.ciudad} - Colombia`}
                </Typography>

                <Typography color="textSecondary" variant="body1">
                  NIT : {`${business?.nit}`}
                </Typography>
                <Typography color="textSecondary" variant="body1">
                  EMPRESA
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
                    disabled={user?.usuario?.rol !== "Admin"}
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
                subheader="Esta informacion puede ser modificada por el usuario master *"
                title="Perfil empresarial"
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Nit *"
                      placeholder="Nit"
                      margin="normal"
                      name="nit"
                      type="text"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.nit}
                      variant="outlined"
                      inputRef={register({ required: true })}
                      helperText={errors.nit ? errors.nit.message : ""}
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
                      label="Pais *"
                      placeholder="Ingrese su pais"
                      margin="normal"
                      name="pais"
                      type="text"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.pais}
                      variant="outlined"
                      inputRef={register({ required: true })}
                      helperText={errors.pais ? errors.pais.message : ""}
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
                </Grid>
              </CardContent>
              <Box display="flex" justifyContent="flex-end" p={2}>
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  disabled={user?.usuario?.rol !== "Admin"}
                >
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

InfoEmpresa.propTypes = {
  className: PropTypes.string,
  business: PropTypes.any,
  setExcelMessages: PropTypes.any,
};

export default InfoEmpresa;
