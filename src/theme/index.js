import "react-perfect-scrollbar/dist/css/styles.css";
import "../mixins/chartjs";

import React from "react";
import { useSelector } from "react-redux";

import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
  colors,
} from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";

import AppRouting from "../AppRouting";
import typography from "./typography";
import shadows from "./shadows";
import GlobalStyles from "../components/GlobalStyles";

const AppTheming = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const { user } = useSelector((state) => state.auth);

  let lightMode = user
    ? user.opciones?.temaApp === "Claro"
      ? true
      : false
    : window.localStorage.getItem("theme_app")
    ? window.localStorage.getItem("theme_app") === "Claro"
      ? true
      : false
    : prefersDarkMode
    ? false
    : true;

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: lightMode ? "light" : "dark",
          background: {
            default: lightMode ? "#fafafa" : "#303030",
            paper: lightMode ? "#ffffff" : "#424242",
          },
          primary: {
            main: lightMode ? colors.blue[500] : "#308ee0",
          },
          header: {
            main: colors.blue[500],
          },
          secondary: {
            main: lightMode ? colors.deepPurple[500] : "#FF5733",
          },
          text: {
            primary: lightMode ? "rgba(0, 0, 0, 0.8)" : "#fff",
            secondary: lightMode
              ? colors.blueGrey[800]
              : "rgba(255, 255, 255, 0.7)",
            disabled: lightMode
              ? "rgba(0, 0, 0, 0.38)"
              : "rgba(255, 255, 255, 0.5)",
          },
          divider: lightMode
            ? "rgba(0, 0, 0, 0.12)"
            : "rgba(255, 255, 255, 0.12)",
        },
        typography,
        shadows,
      }),
    [lightMode]
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AppRouting />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default AppTheming;
