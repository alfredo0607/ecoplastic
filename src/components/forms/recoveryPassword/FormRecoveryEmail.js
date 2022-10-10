import React, { useState } from "react";
import FormRecoveryEmailFirst from "./FormRecoveryEmailFirst";
import FormRecoveryEmailSecond from "./FormRecoveryEmailSecond";

const FormRecoveryEmail = ({ handleBack, handleNext }) => {
  const [stateEmail, setStateEmail] = useState(false);

  return stateEmail ? (
    <FormRecoveryEmailSecond
      handleNext={handleNext}
      setEmailState={setStateEmail}
    />
  ) : (
    <FormRecoveryEmailFirst
      handleBack={handleBack}
      setEmailState={setStateEmail}
    />
  );
};

export default FormRecoveryEmail;
