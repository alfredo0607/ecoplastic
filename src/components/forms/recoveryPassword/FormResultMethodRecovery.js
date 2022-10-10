import React from "react";
import { useSelector } from "react-redux";
import { Fade } from "@material-ui/core";
import FormRecoveryQuestions from "./FormRecoveryQuestions";
import FormRecoveryEmail from "./FormRecoveryEmail";

const FormResultMethodRecovery = ({ handleNext, handleBack }) => {
  const {
    registerTemp: { metodoRecuperacion },
  } = useSelector((state) => state.auth);

  return (
    <Fade in>
      {metodoRecuperacion === "email" ? (
        <FormRecoveryEmail handleNext={handleNext} handleBack={handleBack} />
      ) : (
        <FormRecoveryQuestions
          handleNext={handleNext}
          handleBack={handleBack}
        />
      )}
    </Fade>
  );
};

export default FormResultMethodRecovery;
