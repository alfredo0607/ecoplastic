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
/* Icons */
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import LockIcon from "@mui/icons-material/Lock";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ValidateCedula from "../components/forms/registe_users/ValidateCedula";
import RegisterPassword from "../components/forms/register/registerPassword";
import RegisterFormQuestions from "../components/forms/register/RegisterFormQuestions";
import useStepperFormBase from "../hooks/useStepperFormBase";
import Page from "../components/Page";
import DividerWithText from "../components/utils/DividerWithText";

function getStepContent(stepIndex, handleNext) {
  switch (stepIndex) {
    case 0:
      return <ValidateCedula handleNext={handleNext} />;
    case 1:
      return <RegisterPassword handleNext={handleNext} />;
    case 2:
      return <RegisterFormQuestions handleNext={handleNext} type={"usuario"} />;
    default:
      return "Unknown stepIndex";
  }
}

function getSteps() {
  return ["Validar cedula", "Crear contraseña", "Utimos pasos"];
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
    2: <LockIcon />,
    3: <SecurityRoundedIcon />,
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

export default function RegisterUsersView() {
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
              Nuevo Registro
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
}
