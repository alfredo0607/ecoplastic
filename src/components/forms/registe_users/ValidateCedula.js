import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Fade,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { fetchRequest } from "../../../helpers/fetchRequest";
import { setTempDatRegister } from "../../../redux/actions/authActions";
import FormTextRequired from "../common/FormTextRequired";

const schema = yup.object().shape({
  cedula: yup.string().required("La cedula es requerida"),
});

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(1),
  },
}));

export default function ValidateCedula({ handleNext, type = "register" }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSubmitSecondForm = async (data) => {
    setLoading(true);
    setError(null);

    try {
      if (type === "register") {
        const resp = await fetchRequest(
          `/users/auth/validate-cedula/${data.cedula}`,
          "POST"
        );

        setLoading(false);

        const { registrado, message } = resp.data.data;

        if (registrado === true) {
          dispatch(setTempDatRegister(data));
          handleNext();
        } else {
          setError(message);
        }
        return;
      }

      if (type === "recovery") {
        const resp = await fetchRequest(
          `/users/auth/validate-cedula/${data.cedula}?type=recovery`,
          "POST"
        );

        setLoading(false);

        const { registrado, message } = resp.data.data;

        if (registrado === true) {
          dispatch(setTempDatRegister(data));
          handleNext();
        } else {
          setError(message);
        }
        return;
      }
    } catch (error) {
      setLoading(false);
      setError(
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
            Validar Cedula
            <FormTextRequired />
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Cedula *"
          margin="normal"
          name="cedula"
          variant="outlined"
          autoComplete="off"
          inputProps={{
            className: classes.input,
          }}
          error={!!errors.cedula}
          helperText={errors.cedula ? errors.cedula.message : ""}
          inputRef={register}
        />

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
            Verificar
          </Button>
        </div>
      </form>
    </Fade>
  );
}
