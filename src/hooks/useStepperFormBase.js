import React, { useState } from "react";
import PropTypes from "prop-types";
import { Stepper, Step, StepLabel, StepConnector } from "@mui/material";
import withStyles from "@mui/styles/withStyles";
import makeStyles from "@mui/styles/makeStyles";

const QontoConnector = withStyles((theme) => ({
  alternativeLabel: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  active: {
    "& $line": {
      borderColor: theme.palette.primary.main,
    },
  },
  completed: {
    "& $line": {
      borderColor: theme.palette.primary.main,
    },
  },
  line: {
    borderColor: "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}))(StepConnector);

const useStyles = makeStyles(() => ({
  stepper: {
    background: "transparent",
    padding: "10px 0",
    margin: "5px",
  },
}));

const useStepperFormBase = ({
  getSteps,
  getContentSteps,
  finishStepComponent: FinishStepComponent,
  withLabels = false,
  connector: Connector = QontoConnector,
  iconComponent,
  withIcons = true,
}) => {
  const classes = useStyles();

  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const printStepper = () => (
    <>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        className={classes.stepper}
        connector={<Connector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            {withIcons ? (
              <StepLabel StepIconComponent={iconComponent}>
                {withLabels && label}
              </StepLabel>
            ) : (
              <StepLabel>{withLabels && label}</StepLabel>
            )}
          </Step>
        ))}
      </Stepper>

      <div>
        {activeStep === steps.length ? (
          <FinishStepComponent />
        ) : (
          getContentSteps(activeStep, handleNext, handleBack)
        )}
      </div>
    </>
  );

  return { printStepper, steps, activeStep };
};

useStepperFormBase.propTypes = {
  getSteps: PropTypes.func.isRequired,
  getContentSteps: PropTypes.func.isRequired,
  finishStepComponent: PropTypes.node.isRequired,
};

export default useStepperFormBase;
