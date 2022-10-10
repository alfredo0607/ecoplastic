import React from "react";
import InputPassword from "./InputPassword";

const FormPassword = ({ register, errors }) => {
  return (
    <>
      <InputPassword
        register={register}
        errors={errors}
        label="Contraseña *"
        helperText="La contraseña debe contener minimo 8 caracteres."
        name="password"
      />

      <InputPassword
        register={register}
        errors={errors}
        label="Confirmación de la contraseña *"
        name="password2"
      />
    </>
  );
};

export default FormPassword;
