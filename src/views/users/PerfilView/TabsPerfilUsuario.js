import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { Grid } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import PhoneIcon from "@mui/icons-material/Phone";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

/* Icons */
import PersonIcon from "@mui/icons-material/Person";
import InfoBasicaForm from "./form/InfoBasicaForm";
import InfoUbicacionForm from "./form/InfoUbicacionForm";
import InfoTelefonoForm from "./form/InfoTelefonoForm";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Paper style={{ height: "100%" }}>
          <Box p={3} style={{ height: "100%" }}>
            {children}
          </Box>
        </Paper>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const a11yProps = (index) => {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
};

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: `${theme.spacing(1)} auto`,
    display: "flex",
  },
  tabs: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "5px",
    marginTop: 0,
    boxShadow: theme.shadows[1],
    marginBottom: theme.spacing(3),
  },
  tabPanel: {
    width: "100%",
    minHeight: window.innerHeight - 110,
    position: "relative",
  },
}));

const useQueryParams = () => {
  return new URLSearchParams(useLocation().search);
};

const TabsPerfilUsuario = ({ idUser, setUserInfo }) => {
  const query = useQueryParams();
  const navigate = useNavigate();
  const classes = useStyles();

  const [value, setValue] = useState(0);

  const tabsToRender = useMemo(() => {
    let tabs = [];

    const tabItem1 = {
      label: "Información Básica",
      name: "basica",
      icon: <PersonIcon />,
      Component: InfoBasicaForm,
      props: { idUser, setUserInfo: setUserInfo },
    };

    tabs = [...tabs, tabItem1];

    const tabItem = {
      label: "Ubicación",
      name: "ubicacion",
      icon: <LocationCityIcon />,
      Component: InfoUbicacionForm,
      props: { idUser },
    };

    tabs = [...tabs, tabItem];

    const tabItem2 = {
      label: "Contacto de emergencia",
      name: "agenda",
      icon: <PhoneIcon />,
      Component: InfoTelefonoForm,
      props: { idUser },
    };

    tabs = [...tabs, tabItem2];

    return tabs;
  }, []);

  const handleChange = (event, newValue) => {
    const { name } = tabsToRender.find((tab, index) => index === newValue);

    navigate(`?tab=${name}`, { replace: true });
    setValue(newValue);
  };

  useEffect(() => {
    if (query.get("tab")) {
      const indexTab = tabsToRender.findIndex(
        (tab) => tab.name === query.get("tab")
      );
      const validateIndex = indexTab !== -1 ? indexTab : 0;

      setValue(validateIndex);
    }
  }, []);

  return (
    <>
      <Grid item xs={12} md={9}>
        <Tabs
          orientation="horizontal"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          indicatorColor="primary"
          textColor="primary"
          className={classes.tabs}
        >
          {tabsToRender.map((item, index) => (
            <Tab
              key={String(index)}
              icon={item.icon}
              label={item.label}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
        <div className={classes.tabPanel}>
          {tabsToRender.map(({ Component, props }, index) => (
            <TabPanel
              key={String(index)}
              className={classes.tabPanel}
              value={value}
              index={index}
            >
              <Component {...props} />
            </TabPanel>
          ))}
        </div>
      </Grid>
    </>
  );
};

export default TabsPerfilUsuario;
