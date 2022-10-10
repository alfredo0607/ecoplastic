import React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Typography,
  Box,
  CircularProgress,
  Button,
  Container,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import clsx from "clsx";
import * as yup from "yup";
/* Icons */
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import LockIcon from "@mui/icons-material/Lock";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Page from "../../components/Page";
import RegisterFormCedula from "../../components/forms/common/RegisterFormCedula";
import RegisterForm from "../../components/forms/register/RegisterForm";
import RegisterFormQuestions from "../../components/forms/register/RegisterFormQuestions";
import useStepperFormBase from "../../hooks/useStepperFormBase";
import DividerWithText from "../../components/utils/DividerWithText";
import RegisterPassword from "../../components/forms/register/registerPassword";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

/* Stepper Params */
function getSteps() {
  return [
    "Registrar empresa",
    "Registrar usuario master",
    "Crear contraseña",
    "Utimos pasos",
  ];
}

function getStepContent(stepIndex, handleNext) {
  switch (stepIndex) {
    case 0:
      return <RegisterFormCedula handleNext={handleNext} />;
    case 1:
      return <RegisterForm handleNext={handleNext} />;
    case 2:
      return <RegisterPassword handleNext={handleNext} />;
    case 3:
      return <RegisterFormQuestions handleNext={handleNext} />;
    default:
      return "Unknown stepIndex";
  }
}

const FinishStepComponent = () => (
  <>
    <Box mb={2} display="flex" alignItems="center" justifyContent="center">
      <Typography variant="h3">Registro Exitoso!</Typography>
      <CheckCircleIcon color="primary" />
    </Box>

    <Box>
      <Typography display="inline">
        Tu registro se completo exitosamente, te estamos redirigiendo a la
        pantalla de inicio de sesión
      </Typography>
      <CircularProgress color="primary" size={12} />
    </Box>
  </>
);

const useQontoStepIconStyles = makeStyles((theme) => ({
  root: {
    color: "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
  },
  active: {
    color: theme.palette.primary.main,
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  completed: {
    color: theme.palette.primary.main,
    zIndex: 1,
    fontSize: 18,
  },
}));

function StepIcons(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <AddBusinessIcon />,
    2: <PersonAddIcon />,
    3: <LockIcon />,
    4: <SecurityRoundedIcon />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}
/* End Stepper params */

const RegisterView = () => {
  const navigate = useNavigate();

  const { printStepper, steps, activeStep } = useStepperFormBase({
    getSteps,
    getContentSteps: getStepContent,
    finishStepComponent: FinishStepComponent,
    withLabels: false,
    withIcons: true,
    iconComponent: StepIcons,
  });

  if (activeStep === steps.length) {
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 3000);
  }

  return (
    <Page title="Nuevo Registro">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container>
          <Box mb={3}>
            <Typography color="textPrimary" variant="h2">
              Nuevo Registro de empresa
            </Typography>

            <Typography color="textSecondary" gutterBottom variant="body2">
              Registrate para gestionar tu perfil.
            </Typography>
          </Box>

          {printStepper()}

          <Box mt={1}>
            <DividerWithText spacing={1}>
              <Typography variant="caption" style={{ color: "grey" }}>
                ¿Ya tienes una cuenta?
              </Typography>
            </DividerWithText>
          </Box>

          <Box my={2}>
            <RouterLink to="/login">
              <Button fullWidth size="medium" variant="outlined">
                Iniciar Sesión
              </Button>
            </RouterLink>
          </Box>
        </Container>
      </Box>
    </Page>
  );
};

export default RegisterView;
