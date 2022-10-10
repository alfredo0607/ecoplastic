import React, { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import Page from "../../components/Page";
import LockScreenForm from "../../components/forms/login/LockScreenForm";
import LoginHomeForm from "../../components/forms/login/LoginHomeForm";

const LoginView = () => {
  const [lockScreen, setLockScreen] = useState(null);
  const [dataUser, setDataUser] = useState({});

  useEffect(() => {
    if (localStorage.getItem("dataUserLocked")) {
      const data = JSON.parse(localStorage.getItem("dataUserLocked"));
      setDataUser(data);
      setLockScreen(true);
    }
  }, [setDataUser, setLockScreen]);

  return (
    <Page title="Inicio de sesión">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container>
          {lockScreen ? (
            <LockScreenForm setLockScreen={setLockScreen} dataUser={dataUser} />
          ) : (
            <LoginHomeForm setLockScreen={setLockScreen} />
          )}
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
