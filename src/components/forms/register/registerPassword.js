import { yupResolver } from "@hookform/resolvers/yup";
import { Button, CircularProgress, Fade, Typography, Box } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import React, { useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import FormPassword from "../common/FormPassword";
import FormTextRequired from "../common/FormTextRequired";
import { useDispatch } from "react-redux";
import { setTempDatRegister } from "../../../redux/actions/authActions";
// import FormTextRequired from "../common/FormTextRequired";

const schema = yup.object().shape({
  password: yup
    .string()
    .required("La contraseña es requerida")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
      "La contraseña debe contener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número"
    ),
  password2: yup
    .string()
    .oneOf([yup.ref("password"), null], "Las contraseñas deben coincidir"),
});

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(1),
  },
}));

const RegisterPassword = ({ handleNext }) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState(null);

  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSubmitSecondForm = async (data) => {
    setLoading(true);
    seterror(null);

    try {
      dispatch(setTempDatRegister(data));
      setLoading(false);
      handleNext();
    } catch (error) {
      setLoading(false);
      seterror(
        error.response?.data.errores ||
          "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde"
      );
    }
  };

  return (
    <Fade in>
      <form onSubmit={handleSubmit(handleSubmitSecondForm)}>
        <Box mb={1}>
          <Typography color="textPrimary" variant="h4">
            Crear nueva contraseña
            <FormTextRequired />
          </Typography>
        </Box>

        <FormPassword register={register} errors={errors} />

        {error && (
          <Typography color="error" gutterBottom variant="caption">
            {error}
          </Typography>
        )}

        <div className={classes.root}>
          {loading ? <CircularProgress size={24} /> : <div></div>}

          <Button
            disabled={loading}
            type="submit"
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardRoundedIcon />}
          >
            Continuar
          </Button>
        </div>
      </form>
    </Fade>
  );
};

export default RegisterPassword;
