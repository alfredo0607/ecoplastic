import React, { useState } from "react";
import { useDispatch } from "react-redux";

import {
  Fade,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Typography,
} from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { setTempDatRegister } from "../../../redux/actions/authActions";

// import { setTempDatRegister } from "src/redux/actions/authActions";

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(1),
  },
}));

const FormMethodRecovery = ({ handleNext }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [valueRadio, setValueRadio] = useState("email");

  const handleMethodRecovery = async (e) => {
    e.preventDefault();
    dispatch(setTempDatRegister({ metodoRecuperacion: valueRadio }));
    handleNext();
  };

  const handleChange = (e) => setValueRadio(e.target.value);

  return (
    <Fade in>
      <form onSubmit={handleMethodRecovery}>
        <Grid container direction="column" justifyContent="center">
          <FormControl component="fieldset">
            <FormLabel component="legend" color="primary">
              Metodo de recuperación
            </FormLabel>
            <RadioGroup
              aria-label="Metodo de recuperación"
              name="metodoRecuperacion"
              value={valueRadio}
              onChange={handleChange}
            >
              <FormControlLabel
                value="email"
                control={<Radio />}
                label={
                  <Typography color="textPrimary">
                    Enviame un codigo a mi email
                  </Typography>
                }
              />
              <FormControlLabel
                value="preguntas"
                control={<Radio />}
                label={
                  <Typography color="textPrimary">
                    Responder preguntas de seguridad
                  </Typography>
                }
              />
            </RadioGroup>
          </FormControl>

          <div className={classes.root}>
            <div></div>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardRoundedIcon />}
            >
              Continuar
            </Button>
          </div>
        </Grid>
      </form>
    </Fade>
  );
};

export default FormMethodRecovery;
