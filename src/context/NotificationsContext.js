/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import CancelIcon from "@mui/icons-material/Cancel";
import TelegramIcon from "@mui/icons-material/Telegram";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MessageIcon from "@mui/icons-material/Message";
import CommentIcon from "@mui/icons-material/Comment";
import { useSocket } from "../hooks/useSocket";
import { fetchRequest, setRequestToken } from "../helpers/fetchRequest";
import { getUserToken } from "../helpers/setGetToken";

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const {
    user: { usuario },
  } = useSelector((state) => state.auth);

  /* Hook para conectarse al servidor de sockets */
  const [socket, online] = useSocket(
    "http://localhost:3006",
    usuario?.idUsuario
  );

  /* Estado general del provider */
  const [loadingNotificaciones, setLoadingNotificaciones] = useState(false);
  const [total, setTotal] = useState(0);
  const [notificaciones, setNotificaciones] = useState([]);
  const [error, setError] = useState(null);
  const notificationsObject = useMemo(
    () => responseToNotificationObject(notificaciones),
    [notificaciones]
  );

  const getNotificaciones = async () => {
    setLoadingNotificaciones(true);

    try {
      const url = `/notificaciones/get_notificaciones_user/${usuario?.idUsuario}`;

      const token = getUserToken();
      setRequestToken(token);

      const {
        data: { data },
      } = await fetchRequest(url);
      const { total, notifications } = data;

      setTotal(total);
      setNotificaciones(notifications);
    } catch (error) {
      let msgError = "";

      if (error.response?.status === 422)
        msgError = error.response.data.data.errores;
      else
        msgError =
          "Ocurrio un error interno del servidor, por favor intentalo de nuevo más tarde";

      setError(msgError);
    } finally {
      setLoadingNotificaciones(false);
    }
  };

  const updateNumNotification = async () => {
    if (total > 0) {
      setTotal(total - 1);
    }
  };

  useEffect(() => {
    const callbackNuevaNotificacion = (data) => {
      setNotificaciones((prevState) => [data.notifications, ...prevState]);
      setTotal(data.totalNotifications);
    };

    socket.on(
      `nueva notificacion ${usuario.idUsuario}`,
      callbackNuevaNotificacion
    );

    return () => {
      socket.off(
        `nueva notificacion ${usuario.idUsuario}`,
        callbackNuevaNotificacion
      );
    };
  }, [socket]);

  useEffect(() => {
    getNotificaciones();
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        online,
        socket,
        total,
        notificationsObject,
        loadingNotificaciones,
        updateNumNotification,
        error,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

/* Transformar la respuesta de las notificaciones en una obejto valido de notificación */
const responseToNotificationObject = (responseData) => {
  const notifcationArray = responseData.map((item) => ({
    ...item,
    ...getTextContentNotification(item),
  }));

  return notifcationArray;
};

const getTextContentNotification = (item) => {
  let textContentObject = {};

  if (item.type === "nueva_solicitud") {
    textContentObject = {
      iconBadge: TelegramIcon,
      userName: item.nombreEnvia,
      typeNotification: "",
      badgeText: {
        text: item.tipoSolicitud,
        background: item.fondoTipoSolicitud,
      },
      middleContent: "envio una nueva solicitud",
    };
  }

  if (item.type === "nueva_mensaje_solicitud") {
    textContentObject = {
      iconBadge: MessageIcon,
      userName: item.nombreEnvia,
      typeNotification: `solicitud #${item.idReferencia}`,
      middleContent: "te envio un nuevo mensaje en",
    };
  }

  if (item.type === "nueva_aprobar_solicitud") {
    textContentObject = {
      iconBadge: CheckCircleIcon,
      userName: item.nombreEnvia,
      typeNotification: `solicitud #${item.idReferencia}`,
      middleContent: "felicidades aprobamos tu",
    };
  }

  if (item.type === "nueva_rechazar_solicitud") {
    textContentObject = {
      iconBadge: CancelIcon,
      userName: item.nombreEnvia,
      typeNotification: `solicitud #${item.idReferencia}`,
      middleContent: "lo sentimos rechazamos tu",
    };
  }

  if (item.type === "nueva_comentario") {
    textContentObject = {
      iconBadge: CommentIcon,
      userName: item.nombreEnvia,
      typeNotification: `nuevo comentario`,
      middleContent: "realizo un",
    };
  }

  return textContentObject;
};
