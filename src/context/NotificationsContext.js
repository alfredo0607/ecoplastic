import React, { createContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import NotesIcon from "@mui/icons-material/Notes";
import CancelIcon from "@mui/icons-material/Cancel";
import TelegramIcon from "@mui/icons-material/Telegram";
import PushPinIcon from "@mui/icons-material/PushPin";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
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
  const [totalNotificaciones, setTotalNotificaciones] = useState(0);
  const [notificacionesPqr, setNotificacionesPqr] = useState([]);
  const [notificacionesRequest, setNotificacionesRequest] = useState([]);
  const [notificacionesRequestTotal, setNotificacionesRequestTotal] = useState(
    []
  );
  const [error, setError] = useState(null);

  const notificationsObject = useMemo(
    () => responseToNotificationObject(notificacionesPqr),
    [notificacionesPqr]
  );

  const notificationsObjectRequest = useMemo(
    () => responseToNotificationObject(notificacionesRequest),
    [notificacionesRequest]
  );

  const getNotificaciones = async () => {
    setLoadingNotificaciones(true);

    try {
      const url = `/users/obtener_notificaciones_usuario/${usuario?.idUsuario}?page=0&limit=10`;

      const token = getUserToken();
      setRequestToken(token);

      const {
        data: { data },
      } = await fetchRequest(url);
      const {
        total,
        totalPqr,
        notificationsPqr,
        totalRequest,
        notificationsRequest,
      } = data;

      setTotal(total);

      // PQR
      setTotalNotificaciones(totalPqr);
      setNotificacionesPqr(notificationsPqr);

      // SOLICITUDES
      setNotificacionesRequestTotal(totalRequest);
      setNotificacionesRequest(notificationsRequest);
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

  useEffect(() => {
    const callbackNuevaNotificacion = (data) => {
      setNotificacionesPqr((prevState) => [data.notifications, ...prevState]);
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
        totalNotificaciones,

        notificationsObjectRequest,
        notificacionesRequestTotal,

        loadingNotificaciones,
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
      middleContent: "envio una nueva solicitud de tipo",
    };
  }

  if (item.type === "mensajes_notas") {
    textContentObject = {
      iconBadge: NotesIcon,
      userName: item.nombreEnvia,
      typeNotification: `Nota de solicitud #${item.idReferencia}`,
      middleContent: "te envio un nuevo mensaje en",
    };
  }

  // PQR

  if (item.type === "nueva_pqr") {
    textContentObject = {
      iconBadge: TelegramIcon,
      userName: item.nombreEnvia,
      typeNotification: "",
      middleContent: "envio una nueva PQR",
    };
  }

  if (item.type === "rechazo_pqr") {
    textContentObject = {
      iconBadge: CancelIcon,
      typeNotification: "",
      middleContent: `Su PQR se encuentra rechazada por el area ${item.nombreArea}`,
    };
  }

  if (item.type === "respondida_pqr") {
    textContentObject = {
      iconBadge: TelegramIcon,
      userName: item.nombreEnvia,
      typeNotification: "",
      middleContent: `Su PQR fue respondida por el área ${item.nombreArea}.`,
    };
  }

  if (item.type === "fijada_pqr") {
    textContentObject = {
      iconBadge: PushPinIcon,
      userName: item.nombreEnvia,
      typeNotification: "",
      middleContent: `Su PQR fue fijada por el area ${item.nombreArea}.`,
    };
  }

  if (item.type === "expirar_pqr") {
    textContentObject = {
      iconBadge: AccessTimeIcon,
      userName: item.nombreEnvia,
      typeNotification: "",
      middleContent: `La PQR está a punto de expirar.`,
    };
  }

  return textContentObject;
};
