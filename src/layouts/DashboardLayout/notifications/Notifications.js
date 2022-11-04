/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useCallback, useContext, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  SwipeableDrawer,
  Tooltip,
  Divider,
  Box,
  IconButton,
  Badge,
  Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TocIcon from "@mui/icons-material/Toc";
import ConfigIcon from "mdi-material-ui/Cog";
import Notification from "../../../components/Notification";
import { NotificationsContext } from "../../../context/NotificationsContext";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    width: 350,
    padding: "10px 15px",
  },
  containerList: {
    height: "550px",
    overflowY: "auto",
  },
  containerNoNotifications: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    fontSize: 100,
    color:
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.1)"
        : "rgba(255, 255, 255, 0.1)",
  },
}));

export default function Notifications() {
  const classes = useStyles();

  const { notificationsObject, total, updateNumNotification } =
    useContext(NotificationsContext);

  const [state, setState] = useState({ right: false });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const updateStateNotification = (arrayNotifications = [], idEstado) => {
    arrayNotifications.map((data) =>
      data.idNotificacion === idEstado
        ? (data.estadoNotificacion = 1)
        : data.estadoNotificacion
    );
  };

  const notificationList = useCallback(
    () =>
      notificationsObject.map((item) => (
        <Notification
          key={String(item.idNotificacion)}
          idNotificacion={item.idNotificacion}
          iconAvatar={item.iconBadge}
          avatar={item.avatar}
          notificationDate={item.fechaNotificacion}
          userName={item.userName}
          urlTo={item.referenciaLink}
          notificationState={item.estadoNotificacion}
          notificationType={item.typeNotification}
          badgeText={item.badgeText}
          middleText={item.middleContent}
          setState={setState}
          updateStateNotification={updateStateNotification}
          notificationsObject={notificationsObject}
          type={"notificationPqr"}
          updateNumNotification={updateNumNotification}
        />
      )),
    [notificationsObject]
  );

  return (
    <div>
      {["right"].map((anchor) => (
        <Fragment key={anchor}>
          <IconButton
            onClick={toggleDrawer(anchor, true)}
            color="inherit"
            aria-label="mostrar notificaciones"
            size="large"
          >
            <Badge badgeContent={total} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            <div className={classes.mainContainer}>
              <Box
                mb={1}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h4">Notificaciones</Typography>
                <div>
                  <RouterLink to="notificaciones">
                    <Tooltip title="Ver todas las notificaciones">
                      <IconButton size="small">
                        <TocIcon />
                      </IconButton>
                    </Tooltip>
                  </RouterLink>
                  <RouterLink to="app/settings">
                    <Tooltip title="Configuracion">
                      <IconButton size="small">
                        <ConfigIcon />
                      </IconButton>
                    </Tooltip>
                  </RouterLink>
                </div>
              </Box>

              <Box mt={1} mb={1}>
                <Divider />
              </Box>

              <div className={classes.containerList}>
                {notificationsObject.length > 0 && notificationList()}

                {notificationsObject.length === 0 && (
                  <div className={classes.containerNoNotifications}>
                    <Typography variant="h3" color="inherit">
                      No tienes notificaciones
                    </Typography>
                    <NotificationsIcon fontSize="inherit" color="inherit" />
                  </div>
                )}
              </div>
            </div>
          </SwipeableDrawer>
        </Fragment>
      ))}
    </div>
  );
}
