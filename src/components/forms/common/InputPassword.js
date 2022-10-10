import React, { useState } from "react";

import { TextField, InputAdornment, IconButton } from "@mui/material";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

const InputPassword = ({ register, errors, label, helperText = "", name }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleMouseDownPassword = (e) => e.preventDefault();

  const handleClickShowPassword = () => {
    setShowPassword((state) => !state);
  };

  return (
    <>
      <TextField
        fullWidth
        label={label}
        margin="normal"
        name={name}
        variant="outlined"
        type={showPassword ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="Cambiar visibilidad de la contraseña"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
              >
                {!showPassword ? (
                  <VisibilityRoundedIcon />
                ) : (
                  <VisibilityOffRoundedIcon />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        error={!!errors[name]}
        helperText={errors[name] ? errors[name].message : helperText}
        inputRef={register}
      />
    </>
  );
};

export default InputPassword;
