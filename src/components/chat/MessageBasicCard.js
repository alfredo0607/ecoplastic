import * as React from "react";
import clsx from "clsx";

import dayjs from "dayjs";
import es from "dayjs/locale/es";

import { Typography, Avatar, Tooltip } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";

const useStyles = makeStyles((theme) => {
  const radius = theme.spacing(2.5);
  const avatarWidth = 40;

  return {
    container: {
      width: "100%",
      display: "flex",
      alignItems: "flex-end",
    },
    right: {
      justifyContent: "flex-end",
    },
    left: {
      justifyContent: "flex-start",
    },
    messageContainer: {
      maxWidth: 350,
      padding: theme.spacing(1, 2),
      borderRadius: 4,
      marginBottom: 6,
      overflow: "hidden",
      "& p": {
        marginBottom: 0,
        whiteSpace: "break-spaces",
        wordBreak: "break-word",
      },
    },
    messageContainerRight: {
      backgroundColor: theme.palette.primary.main,
      color: "rgba(255, 255, 255, 0.9)",
      textAlign: "right",
      borderTopLeftRadius: radius,
      borderBottomLeftRadius: radius,
      "& span": {
        color: "rgba(255, 255, 255, 0.4)",
      },
    },
    messageContainerLeft: {
      backgroundColor: theme.palette.divider,
      color:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.9)"
          : "rgba(0, 0, 0, 0.8)",
      textAlign: "left",
      borderTopRightRadius: radius,
      borderBottomRightRadius: radius,
      "& span": {
        color:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.4)"
            : "rgba(0, 0, 0, 0.4)",
      },
    },
    leftFirst: {
      borderTopLeftRadius: radius,
    },
    leftLast: {
      borderBottomLeftRadius: radius,
    },
    rightFirst: {
      borderTopRightRadius: radius,
    },
    rightLast: {
      borderBottomRightRadius: radius,
    },
    dateMessage: {
      display: "flex",
      alignItems: "center",
    },
    avatar: {
      width: avatarWidth,
      height: avatarWidth,
      marginRight: 5,
      marginBottom: 5,
    },
    iconDouble: {
      color: "#EDD63D",
      marginLeft: 5,
    },
    iconSimple: {
      marginLeft: 5,
    },
    leftMargin: {
      marginLeft: avatarWidth + 5,
    },
  };
});

const MessageBasicCard = ({
  side = "left",
  textMessage,
  dateMessage,
  avatarURL,
  senderName,
  viewedForUser = false,
  position,
  sendingMessage,
  wasSended,
}) => {
  const classes = useStyles();

  const attachClass = (position) => {
    if (position === 1) {
      return classes[`${side}First`];
    }

    if (position === 3) {
      return classes[`${side}Last`];
    }

    return "";
  };

  return (
    <div
      className={clsx(classes.container, {
        [classes.left]: side === "left",
        [classes.right]: side === "right",
      })}
    >
      {side === "left" && position === 1 && (
        <Tooltip title={senderName}>
          <Avatar
            src={`https://ecoplastic.herokuapp.com/uploads/images/imagenes_usuarios/${avatarURL}`}
            alt={`Imagen de usuario de: ${senderName}`}
            className={classes.avatar}
          />
        </Tooltip>
      )}

      <div
        className={clsx(classes.messageContainer, {
          [classes.messageContainerRight]: side === "right",
          [classes.messageContainerLeft]: side === "left",
          [attachClass(position)]: true,
          [classes.leftMargin]: position !== 1,
        })}
      >
        {side === "left" && position === 1 && (
          <Typography variant="caption" display="block">
            {senderName}
          </Typography>
        )}
        <Typography paragraph>
          {textMessage}
          <Typography
            className={classes.dateMessage}
            variant="caption"
            style={{
              justifyContent: side === "left" ? "flex-start" : "flex-end",
            }}
          >
            {dayjs(dateMessage).locale(es).format("hh:mm")}
            {side === "right" && sendingMessage && (
              <QueryBuilderIcon
                fontSize="inherit"
                className={classes.iconSimple}
              />
            )}
            {side === "right" && viewedForUser && (
              <DoneAllIcon fontSize="inherit" className={classes.iconDouble} />
            )}
            {side === "right" && !viewedForUser && wasSended && (
              <DoneIcon fontSize="inherit" className={classes.iconSimple} />
            )}
          </Typography>
        </Typography>
      </div>
    </div>
  );
};

export default MessageBasicCard;
