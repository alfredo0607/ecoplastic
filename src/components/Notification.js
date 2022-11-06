import * as React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import { Badge, Avatar, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import hexToRgbColor from "../helpers/hexToRgbColor";
import getTextColorForBackground from "../helpers/getTextColorForBackground";
import { fetchRequest, setRequestToken } from "../helpers/fetchRequest";
import { getUserToken } from "../helpers/setGetToken";

const useStyles = makeStyles((theme) => {
  const colorCoverted = hexToRgbColor(theme.palette.primary.main);
  const primaryColorRgba =
    theme.palette.mode === "light"
      ? `rgba(${colorCoverted.r}, ${colorCoverted.g}, ${colorCoverted.b}, 0.06)`
      : `rgba(${colorCoverted.r}, ${colorCoverted.g}, ${colorCoverted.b}, 0.2)`;

  return {
    notificationContainer: {
      maxWidth: 350,
      height: "90px",
      width: "100%",
      padding: "10px 5px",
      display: "flex",
      borderRadius: "5px",
      alignItems: "center",
      backgroundColor: primaryColorRgba,
      border: `1px solid ${theme.palette.divider}`,
      transition: "background-color .2s ease",
      cursor: "pointer",
      marginBottom: "8px",
      "&:hover": {
        backgroundColor:
          theme.palette.mode === "light"
            ? "rgba(0, 0, 0, 0.04)"
            : "rgba(255, 255, 255, 0.08)",
      },
      "&:last-child": {
        marginBottom: 0,
      },
    },
    notificationReaded: {
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor:
          theme.palette.mode === "light"
            ? "rgba(0, 0, 0, 0.04)"
            : "rgba(255, 255, 255, 0.08)",
      },
    },
    notificationContent: {
      marginLeft: "12px",
    },
    avatarNotification: {
      width: "40px",
      height: "40pxv",
    },
    iconAvatar: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: 5,
    },
    badgeText: {
      display: "inline",
      padding: "1px 3px",
      borderRadius: "5px",
      marginLeft: "3px",
    },
  };
});

const Notification = ({
  iconAvatar: IconAvatar,
  avatar,
  notificationDate,
  userName,
  urlTo,
  notificationState,
  notificationType,
  badgeText = null,
  middleText,
  setState,
  idNotificacion,
  updateStateNotification,
  notificationsObject,
  type,
  updateNumNotification,
}) => {
  const nagivate = useNavigate();
  const classes = useStyles();

  const handleClickNotification = async () => {
    updateStateNotification(notificationsObject, idNotificacion);

    await updateNumNotification();

    nagivate(`..${urlTo}`);
    setState({ right: false });

    try {
      const url = `/notificaciones/update_notificaciones_usuario/${idNotificacion}`;

      const token = getUserToken();
      setRequestToken(token);

      await fetchRequest(url, "PUT");
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return (
    <div
      className={[
        classes.notificationContainer,
        notificationState === 1 ? classes.notificationReaded : null,
      ].join(" ")}
      onClick={handleClickNotification}
    >
      <div className={classes.notificationIcon}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <div className={classes.iconAvatar}>
              <IconAvatar fontSize="small" />
            </div>
          }
        >
          <Avatar
            src={`https://ecoplastic.herokuapp.com/uploads/images/imagenes_usuarios/${avatar}`}
            className={classes.avatarNotification}
          />
        </Badge>
      </div>
      <div className={classes.notificationContent}>
        <Typography variant="body2">
          <b>{userName}</b> {middleText} <b>{notificationType}</b>
          {badgeText && (
            <div
              className={classes.badgeText}
              style={{
                backgroundColor: `#${badgeText?.background}`,
                color: getTextColorForBackground(badgeText?.background),
              }}
            >
              <Typography color="inherit" variant="caption">
                {badgeText?.text}
              </Typography>
            </div>
          )}
        </Typography>
        <Typography variant="caption">
          {dayjs(notificationDate)
            .locale(es)
            .format("DD [de] MMMM [-] hh:mm a")}
        </Typography>
      </div>
    </div>
  );
};

Notification.propTypes = {
  iconAvatar: PropTypes.object.isRequired,
  avatar: PropTypes.string.isRequired,
  notificationDate: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  urlTo: PropTypes.string.isRequired,
  notificationState: PropTypes.number.isRequired,
  notificationType: PropTypes.string.isRequired,
  middleText: PropTypes.string.isRequired,
  setState: PropTypes.any.isRequired,
  idNotificacion: PropTypes.number.isRequired,
  updateStateNotification: PropTypes.any.isRequired,
};

export default React.memo(Notification);
