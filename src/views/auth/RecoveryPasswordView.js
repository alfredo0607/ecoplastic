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
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import ViewStreamRoundedIcon from "@mui/icons-material/ViewStreamRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import InputRoundedIcon from "@mui/icons-material/InputRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Page from "../../components/Page";
import RegisterFormCedula from "../../components/forms/common/RegisterFormCedula";
import useStepperFormBase from "../../hooks/useStepperFormBase";
import DividerWithText from "../../components/utils/DividerWithText";
import FormMethodRecovery from "../../components/forms/recoveryPassword/FormMethodRecovery";
import FormResultMethodRecovery from "../../components/forms/recoveryPassword/FormResultMethodRecovery";
import FormRecoveryPassword from "../../components/forms/recoveryPassword/FormRecoveryPassword";
import ValidateCedula from "../../components/forms/registe_users/ValidateCedula";

/* Stepper Params */
function getSteps() {
  return ["Comprobar cédula", "Registrar usuario", "Ultimos pasos", ""];
}

function getStepContent(stepIndex, handleNext, handleBack) {
  switch (stepIndex) {
    case 0:
      return <ValidateCedula handleNext={handleNext} type={"recovery"} />;
    case 1:
      return <FormMethodRecovery handleNext={handleNext} />;
    case 2:
      return (
        <FormResultMethodRecovery
          handleNext={handleNext}
          handleBack={handleBack}
        />
      );
    case 3:
      return <FormRecoveryPassword handleNext={handleNext} />;
    default:
      return "Unknown stepIndex";
  }
}

const FinishStepComponent = () => (
  <>
    <Box mb={2} display="flex" alignItems="center" justifyContent="center">
      <Typography variant="h3">Actualización exitosa</Typography>
      <CheckCircleIcon color="primary" />
    </Box>

    <Box>
      <Typography display="inline">
        Tu contraseña fue actualizada con exito, te estamos redirigiendo a la
        pantalla de inicio de sesión
      </Typography>
      <CircularProgress color="primary" size={12} />
    </Box>
  </>
);

const useIconsStyles = makeStyles((theme) => ({
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
  const classes = useIconsStyles();
  const { active, completed } = props;

  const icons = {
    1: <AssignmentIndRoundedIcon />,
    2: <ViewStreamRoundedIcon />,
    3: <ListAltRoundedIcon />,
    4: <InputRoundedIcon />,
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

const RecoveryPasswordView = () => {
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
    <Page title="Recuperación de contraseña">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container>
          <Box mb={3}>
            <Typography color="textPrimary" variant="h2">
              Restablece tu contraseña
            </Typography>

            <Typography color="textSecondary" gutterBottom variant="body2">
              Sigue los pasos para reestablecer tu contraseña
            </Typography>
          </Box>

          {printStepper()}

          <Box mt={1}>
            <DividerWithText spacing={1}>
              <Typography variant="caption" style={{ color: "grey" }}>
                ¿Recordaste tu contraseña?
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

export default RecoveryPasswordView;
