import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Container,
  Grid,
  AppBar,
  Tabs,
  Tab,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { MdPerson, MdHttps } from "react-icons/md";
import { RiPagesLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import Page from "../../../components/Page";
import InfoPersonal from "./InfoPersonal";
import {
  getBusinesDetails,
  getUsersDetails,
} from "../../../redux/actions/authActions";
import InfoEmpresa from "./InfoEmpresa";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && <Box paddingY={2}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`,
  };
}

const Cuenta = () => {
  const [value, setValue] = useState(0);
  const [excelMessages, setExcelMessages] = useState({
    type: null,
    message: null,
    where: null,
  });

  const { user, userDetail, business } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCloseSnackbar = () =>
    setExcelMessages({ type: null, message: null });

  useEffect(() => {
    dispatch(getUsersDetails(user?.usuario?.idUsuario));
    dispatch(getBusinesDetails(user?.usuario?.empresa?.idempresa));
  }, []);

  return (
    <Page title="Cuenta">
      <Grid container>
        <Grid item xs={12}>
          <AppBar position="static" color="inherit">
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons
              indicatorColor="primary"
              textColor="primary"
              aria-label="scrollable force tabs example"
              allowScrollButtonsMobile
            >
              <Tab
                label="Perfil"
                icon={<MdPerson style={{ fontSize: 22 }} />}
                {...a11yProps(0)}
              />
              <Tab
                label="Perfil de la empresa"
                icon={<RiPagesLine style={{ fontSize: 22 }} />}
                {...a11yProps(1)}
              />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            {userDetail && (
              <InfoPersonal
                userDetail={userDetail}
                setExcelMessages={setExcelMessages}
              />
            )}
          </TabPanel>
          <TabPanel value={value} index={1}>
            <InfoEmpresa
              business={business}
              setExcelMessages={setExcelMessages}
            />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <h1>Tareas</h1>
          </TabPanel>
        </Grid>
      </Grid>

      <Snackbar
        open={!!excelMessages.message}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={excelMessages.type || "success"}
        >
          {excelMessages.message || ""}
        </Alert>
      </Snackbar>
    </Page>
  );
};

export default Cuenta;
