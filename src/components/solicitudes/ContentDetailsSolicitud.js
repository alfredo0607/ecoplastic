import React, { useEffect, useState, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import dayjs from "dayjs";
import es from "dayjs/locale/es";

import { Box, Typography, Grid, Avatar, Chip, TextField } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Alert, Skeleton } from "@mui/material";

import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import BadgeIcon from "@mui/icons-material/Badge";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import WorkIcon from "@mui/icons-material/Work";
import { getUserToken } from "../../helpers/setGetToken";
import { fetchRequest, setRequestToken } from "../../helpers/fetchRequest";
import ChatContainer from "../chat/ChatContainer";

const useStyles = makeStyles((theme) => ({
  detailsContainer: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    overflowX: "clip",
    overflowY: "visible",
    display: "flex",
    position: "relative",
    flexDirection: "column",
    [theme.breakpoints.down(450)]: {
      flexDirection: "column !important",
    },
    [theme.breakpoints.up("xl")]: {
      flexDirection: "row !important",
    },
  },
  headerDetails: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down(650)]: {
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
  },
  statesDetails: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down(650)]: {
      marginLeft: "0",
      marginTop: "5px",
      marginBottom: "5px",
    },
  },
  stateBadgeBase: {
    marginRight: 10,
    padding: "0 5px",
    borderRadius: "5px",
    color: "#fff",
  },
  estadoSolicitudProceso: {
    backgroundColor: theme.palette.info.dark,
  },
  estadoSolicitudRechazada: {
    backgroundColor: theme.palette.error.main,
  },
  estadoSolicitudResuelta: {
    backgroundColor: theme.palette.success.main,
  },
  fechaCreacion: {
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      justifyContent: "flex-start",
    },
  },
  asunto: {
    marginTop: 15,
    marginBottom: 15,
  },
  containersUserAndForm: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "5px",
    padding: "10px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    height: "90%",
  },
  alertError: {
    marginBottom: 10,
  },
  userNoPermission: {
    width: "100%",
    height: "100%",
    backgroundColor: `${theme.palette.background.paper}E6`,
    position: "absolute",
    top: 0,
    zIndex: 1005,
    textAlign: "center",
    "& > div": {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
  },
  scroll: {
    height: 200,
    maxHeight: 200,
    minHeight: 200,
    overflowY: "auto",
  },
  containerData: {
    display: "flex",
    alignItems: "center",
  },
  row: {
    flexBasis: "50%",
  },
}));

const ContentDetailsSolicitud = ({ type, actualUser }) => {
  const classes = useStyles();
  const isMounted = useRef(true);
  const { search } = useLocation();

  const queryParams = new URLSearchParams(search);

  const {
    user: { usuario },
  } = useSelector((state) => state.auth);

  const configUseChat = useMemo(
    () => ({
      sendMessageConfig: {
        url: `/solicitudes/nuevo_mensaje_solicitud/${queryParams.get("SID")}`,
        method: "POST",
        formatedData: {
          idUsuarioEnvia: usuario.idUsuario,
        },
      },
      loadMessagesConfig: {
        url: `/solicitudes/obtener_mensajes_solicitud/${queryParams.get(
          "SID"
        )}`,
        fieldNameItems: "messages",
        formatResponse: (messages) =>
          messages.map((item) => ({
            messageID: item.idMensaje,
            senderID: item.idSender,
            senderIsCreator: item.senderCreator,
            messageText: item.textoMensaje,
            senderName: item.nombreUsuarioEnvia,
            senderImage: item.imagenUsuarioEnvia,
            messageDate: item.fechaMensaje,
            isFile: item.file,
            isSystem: item.system,
            fileInfo: item.fileInfo,
            hasSended: true,
            hasViewed: false,
          })),
      },
      fieldNameMessage: "textoMensaje",
    }),
    [usuario]
  );

  /* const { inputChatRef, sendNewMessage, items, scrollInfiniteData } = useChatMessages(configUseChat); */

  const [miniMenuOpen, setMiniMenuOpen] = useState({
    open: false,
    buttonActive: "",
    title: "",
    renderComponent: () => null,
  });

  const [userWithoutPermissions, setuserWithoutPermissions] = useState(false);

  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageError, setMessageError] = useState(null);
  let imageusuario;

  const getInfoSolicitud = async () => {
    setLoading(true);

    try {
      const token = getUserToken();
      setRequestToken(token);

      const resp = await fetchRequest(
        `/solicitudes/obtener_solicitud/${queryParams.get("SID")}/${type}`
      );

      const idUserEnvia = resp.data.data.solicitud.fk_usuarioEnvia;
      const sender = parseInt(idUserEnvia) === parseInt(actualUser);

      if (type === "admin") {
        const usuariosGestion = resp.data.data.solicitud.usuariosGestion.map(
          (usuario) => usuario.userID
        );
        /*  ||
          permisos.filter(permiso => permiso.nombreModulo === 'sistema_super_admin')[0] */
        if (usuariosGestion.includes(parseInt(actualUser))) {
          if (isMounted.current) {
            setSolicitud(resp.data.data.solicitud);
            setLoading(false);
          }
        } else {
          if (isMounted.current) {
            setuserWithoutPermissions(true);
          }
        }
      } else {
        if (parseInt(actualUser) === parseInt(idUserEnvia)) {
          if (isMounted.current) {
            setSolicitud(resp.data.data.solicitud);
            setLoading(false);
          }
        } else {
          if (isMounted.current) {
            setuserWithoutPermissions(true);
          }
        }
      }
    } catch (error) {
      let msgError = "";

      if (error.response?.status === 422) {
        msgError =
          "Ocurrio un error obteniendo los datos, por favor asegurate de tener sesión iniciada. Si el error persiste comunicate con un administrador";
      } else {
        msgError =
          "Ocurrio un error interno del servidor, por favor vuelve a intentarlo más tarde.";
      }

      setMessageError(msgError);
    }
  };

  //   useEffect(() => {
  //     if (isMounted.current) {
  //       if (parseInt(actualUser) === parseInt(queryParams.get("UID"))) {
  //         getInfoSolicitud();
  //       } else {
  //         setuserWithoutPermissions(true);
  //       }
  //     }
  //   }, [search, actualUser]);

  //   useEffect(() => {
  //     return () => {
  //       isMounted.current = false;
  //     };
  //   }, []);

  return (
    <div className={classes.detailsContainer}>
      <Box p={2} className={classes.containerData}>
        <div className={classes.row}>
          {messageError && (
            <Alert className={classes.alertError} severity="error">
              {messageError}
            </Alert>
          )}

          <div className={classes.headerDetails}>
            {loading ? (
              <Skeleton
                variant="text"
                animation="pulse"
                width={300}
                height={25}
              />
            ) : (
              <Typography variant="h2">
                Detalles de la solicitud #{queryParams.get("SID")}
              </Typography>
            )}
            <div className={classes.statesDetails}>
              {loading ? (
                <Skeleton
                  variant="text"
                  animation="pulse"
                  width={70}
                  height={30}
                />
              ) : (
                <Typography
                  variant="body2"
                  className={[
                    classes.stateBadgeBase,
                    solicitud.estadoSolicitud === "EN PROCESO"
                      ? classes.estadoSolicitudProceso
                      : solicitud.estadoSolicitud === "RECHAZADA"
                      ? classes.estadoSolicitudRechazada
                      : classes.estadoSolicitudResuelta,
                  ].join(" ")}
                >
                  {solicitud.estadoSolicitud}
                </Typography>
              )}
              {loading ? (
                <Skeleton
                  style={{ marginLeft: 10 }}
                  variant="text"
                  animation="pulse"
                  width={70}
                  height={30}
                />
              ) : (
                <Typography
                  variant="body2"
                  className={classes.stateBadgeBase}
                  style={{
                    backgroundColor: `#${solicitud.colorTipoSolicitud}`,
                    // color: getTextColorForBackground(
                    //   solicitud.colorTipoSolicitud
                    // ),
                  }}
                >
                  {solicitud.textoTipoSolicitud}
                </Typography>
              )}
            </div>
          </div>

          <div className={classes.fechaCreacion}>
            {loading ? (
              <Skeleton variant="text" animation="pulse" width={150} />
            ) : (
              <>
                <Typography variant="caption">
                  {dayjs(solicitud.fechaCreacion)
                    .locale(es)
                    .format("DD [de] MMMM [del] YYYY")}
                </Typography>
                {solicitud.fechaCierre && (
                  <Typography variant="caption">
                    &nbsp;-{" "}
                    {dayjs(solicitud.fechaCierre)
                      .locale(es)
                      .format("DD [de] MMMM [del] YYYY")}
                  </Typography>
                )}
              </>
            )}
          </div>

          {type === "admin" && !loading && (
            <Grid item xs={12} style={{ marginTop: 5 }}>
              <div className={classes.containersUserAndForm}>
                <Typography variant="h6">Información del usuario</Typography>

                <div className={classes.userInfo}>
                  {loading ? (
                    <Skeleton variant="circular" width={90} height={90} />
                  ) : (
                    <Avatar
                      src={`http://localhost:4000/uploads/images/imagenes_usuarios/${solicitud.usuario[0].userImage}`}
                      style={{ width: 90, height: 90 }}
                    />
                  )}

                  <div style={{ marginLeft: 15 }}>
                    {loading ? (
                      <>
                        <Skeleton
                          variant="text"
                          animation="pulse"
                          width={250}
                        />
                        <Skeleton
                          variant="text"
                          animation="pulse"
                          width={250}
                        />
                        <Skeleton
                          variant="text"
                          animation="pulse"
                          width={250}
                        />
                      </>
                    ) : (
                      <>
                        {solicitud.usuario.map((usuario) => (
                          <Chip
                            key={String(usuario.nombre)}
                            icon={<AccountCircleIcon />}
                            size="medium"
                            // variant="outlined"
                            label={usuario.nombre}
                          />
                        ))}
                        <Typography variant="body1">cargo:</Typography>
                        {solicitud.usuario.map((usuario) => (
                          <Chip
                            key={String(usuario.nombre)}
                            icon={<WorkIcon />}
                            size="medium"
                            variant="outlined"
                            label={usuario.cargoLaboral}
                          />
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Grid>
          )}

          <div className={classes.asunto}>
            {loading ? (
              <>
                <Skeleton variant="text" animation="pulse" width="100%" />
                <Skeleton variant="text" animation="pulse" width="100%" />
                <Skeleton variant="text" animation="pulse" width="100%" />
              </>
            ) : (
              <Typography>
                <b>Descripción: </b>
                {solicitud.descripcion}
              </Typography>
            )}
          </div>

          <Grid container item xs={12} spacing={2}>
            {type === "admin" && (
              <Grid item xs={12} md={6}>
                <Typography variant="h6">
                  Usuarios gestionando la solicitud:{" "}
                </Typography>
                {loading ? (
                  <Box display="flex" alignItems="center">
                    <Skeleton
                      style={{ marginRight: 10 }}
                      variant="text"
                      animation="pulse"
                      width={70}
                      height={35}
                    />
                    <Skeleton
                      style={{ marginRight: 10 }}
                      variant="text"
                      animation="pulse"
                      width={70}
                      height={35}
                    />
                    <Skeleton
                      style={{ marginRight: 10 }}
                      variant="text"
                      animation="pulse"
                      width={70}
                      height={35}
                    />
                  </Box>
                ) : (
                  <>
                    {solicitud.usuariosGestion.map((usuario) => (
                      <Chip
                        key={String(usuario.userID)}
                        icon={<VerifiedUserIcon />}
                        size="small"
                        variant="outlined"
                        label={usuario.nombre}
                      />
                    ))}
                  </>
                )}
              </Grid>
            )}

            <Grid item xs={12} md={type === "admin" ? 6 : 12}>
              <Typography variant="h6">
                Areas encargadas de la solicitud:{" "}
              </Typography>
              {loading ? (
                <Box display="flex" alignItems="center">
                  <Skeleton
                    style={{ marginRight: 10 }}
                    variant="text"
                    animation="pulse"
                    width={70}
                    height={35}
                  />
                  <Skeleton
                    style={{ marginRight: 10 }}
                    variant="text"
                    animation="pulse"
                    width={70}
                    height={35}
                  />
                  <Skeleton
                    style={{ marginRight: 10 }}
                    variant="text"
                    animation="pulse"
                    width={70}
                    height={35}
                  />
                </Box>
              ) : (
                <>
                  {solicitud.areas.map((area) => (
                    <Chip
                      key={String(area.idArea)}
                      icon={<SupervisedUserCircleIcon />}
                      size="small"
                      variant="outlined"
                      label={area.nombreArea}
                    />
                  ))}
                </>
              )}
            </Grid>
          </Grid>
        </div>

        <Box mt={2} className={classes.row}>
          <ChatContainer configUseChat={configUseChat} />
        </Box>
      </Box>
    </div>
  );
};

export default ContentDetailsSolicitud;
