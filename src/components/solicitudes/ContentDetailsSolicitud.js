/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import { Box, Typography, Grid, Avatar, Chip, Button } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Alert, Skeleton } from "@mui/material";
import { getUserToken } from "../../helpers/setGetToken";
import { fetchRequest, setRequestToken } from "../../helpers/fetchRequest";
import ChatContainer from "../chat/ChatContainer";
import { useChatMessages } from "../../hooks/useChatMessages";
import CardProduct from "./CardProduct";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import FormPedidos from "../forms/pedidos/FormPedidos";

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

  titleText: {
    color:
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.7)"
        : "rgba(255, 255, 255, 0.9)",
  },
}));

const ContentDetailsSolicitud = () => {
  const classes = useStyles();

  const { type, id } = useParams();

  const {
    user: { usuario },
  } = useSelector((state) => state.auth);

  const configUseChat = useMemo(
    () => ({
      sendMessageConfig: {
        url: `/solicitudes/nuevo_mensaje/${usuario.idUsuario}/${id}`,
        method: "POST",
        formatedData: {
          idUsuarioEnvia: usuario.idUsuario,
        },
      },
      loadMessagesConfig: {
        url: `/solicitudes/obtener_mensajes_solicitud/${id}`,
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

  useChatMessages(configUseChat);

  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageError, setMessageError] = useState(null);
  const [open, setOpen] = useState(false);
  const [openRechazada, setopenRechazada] = useState(false);
  const [openDetalle, setopenDetalle] = useState(false);

  const getInfoSolicitud = async () => {
    setLoading(true);

    try {
      const token = getUserToken();
      setRequestToken(token);

      const resp = await fetchRequest(
        `/solicitudes/get_solicitud_detalle/${id}/${type}`
      );

      setSolicitud(resp.data.data.solicitud);

      setLoading(false);
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
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseRechazada = () => {
    setopenRechazada(false);
  };

  const handleCloseDetalle = () => {
    setopenDetalle(false);
  };

  const updateStatusSolicitud = (newStatus) => {
    setSolicitud({ ...solicitud, estado: newStatus });
  };

  const updateSolicitudAprobada = async (data) => {
    setSolicitud({ ...solicitud, data });
  };

  useEffect(() => {
    getInfoSolicitud();
  }, []);

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
              <Typography className={classes.titleText} variant="h2">
                Detalles de la solicitud #{id}
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
                    solicitud.estado === "En revision"
                      ? classes.estadoSolicitudProceso
                      : solicitud.estado === "Rechazada"
                      ? classes.estadoSolicitudRechazada
                      : classes.estadoSolicitudResuelta,
                  ].join(" ")}
                >
                  {solicitud.estado}
                </Typography>
              )}
            </div>

            <div className={classes.statesDetails}>
              {loading ? (
                <Skeleton
                  variant="text"
                  animation="pulse"
                  width={70}
                  height={30}
                />
              ) : (
                solicitud?.estado === "En revision" &&
                solicitud?.idusers_envia !== usuario.idUsuario && (
                  <Box>
                    <Button onClick={() => setOpen(true)}>Aprobar</Button>
                    <Button onClick={() => setopenRechazada(true)}>
                      Rechazar
                    </Button>
                  </Box>
                )
              )}
            </div>

            <div className={classes.statesDetails}>
              {solicitud?.estado === "Aprobada" && (
                <Box>
                  <Button onClick={() => setopenDetalle(true)}>
                    Detaller de entrega
                  </Button>
                </Box>
              )}
            </div>
          </div>

          <div className={classes.fechaCreacion}>
            {loading ? (
              <Skeleton variant="text" animation="pulse" width={150} />
            ) : (
              <>
                <Typography variant="caption">
                  {dayjs(solicitud.createDate)
                    .locale(es)
                    .format("DD [de] MMMM [del] YYYY")}
                </Typography>
              </>
            )}
          </div>

          <div className={classes.asunto}>
            {loading ? (
              <>
                <Skeleton variant="text" animation="pulse" width="100%" />
                <Skeleton variant="text" animation="pulse" width="100%" />
                <Skeleton variant="text" animation="pulse" width="100%" />
              </>
            ) : (
              <Typography className={classes.titleText}>
                {solicitud.mensaje}
              </Typography>
            )}
          </div>

          <Typography className={classes.titleText} variant="h4">
            {" "}
            {solicitud?.idusers_envia === usuario.idUsuario
              ? "Información del operario"
              : "Información de solicitante"}
          </Typography>
          {!loading && (
            <Grid item xs={12} style={{ marginTop: 5 }}>
              {solicitud?.idusers_envia === usuario.idUsuario && (
                <div className={classes.userInfo}>
                  <div style={{ marginTop: 2 }}>
                    {loading ? (
                      <>
                        <Skeleton
                          variant="text"
                          animation="pulse"
                          width={250}
                        />
                      </>
                    ) : (
                      <>
                        {solicitud.userGestiona &&
                          solicitud.userGestiona.map((usuario) => (
                            <Chip
                              key={String(usuario.nombre)}
                              icon={
                                <Avatar
                                  src={`http://localhost:3006/uploads/images/imagenes_usuarios/${solicitud.userGestiona[0].userImage}`}
                                  style={{ width: 30, height: 30 }}
                                />
                              }
                              size="medium"
                              // variant="outlined"
                              label={
                                usuario.nombre + " - " + usuario.nombre_empresa
                              }
                            />
                          ))}
                      </>
                    )}
                  </div>
                </div>
              )}

              {solicitud?.idusers_envia !== usuario.idUsuario && (
                <div className={classes.userInfo}>
                  <div style={{ marginTop: "4px" }}>
                    {loading ? (
                      <>
                        <Skeleton
                          variant="text"
                          animation="pulse"
                          width={250}
                        />
                      </>
                    ) : (
                      <>
                        {solicitud.userEnvia &&
                          solicitud.userEnvia.map((usuario) => (
                            <Chip
                              key={String(usuario.nombre)}
                              icon={
                                <Avatar
                                  src={`http://localhost:3006/uploads/images/imagenes_usuarios/${solicitud.userEnvia[0].userImage}`}
                                  style={{ width: 30, height: 30 }}
                                />
                              }
                              size="medium"
                              // variant="outlined"
                              label={
                                usuario.nombre + " - " + usuario.nombre_empresa
                              }
                            />
                          ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </Grid>
          )}

          <Typography
            className={classes.titleText}
            marginTop={2}
            marginBottom={2}
            variant="h2"
          >
            Productos a intercambiar
          </Typography>
          <Box margin={2} display="flex" alignContent={"center"}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={5}>
                {solicitud?.productoSolicitud?.length !== 0 &&
                  solicitud?.productoSolicitud.map((data) => (
                    <CardProduct key={data.cover} data={data} />
                  ))}
              </Grid>
              <Grid
                item
                xs={2}
                width={"100%"}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <SyncAltIcon sx={{ fontSize: 60 }} />
              </Grid>
              <Grid item xs={5}>
                {solicitud?.productoIntercambio?.length !== 0 &&
                  solicitud?.productoIntercambio.map((data) => (
                    <CardProduct key={data.cover} data={data} />
                  ))}
              </Grid>
            </Grid>
          </Box>
        </div>

        {solicitud?.estado !== "Rechazada" && (
          <Box className={classes.row}>
            <ChatContainer configUseChat={configUseChat} />
          </Box>
        )}
      </Box>

      <FormPedidos
        open={open}
        handleClose={handleClose}
        id={id}
        updateStatusSolicitud={updateStatusSolicitud}
        openRechazada={openRechazada}
        handleCloseRechazada={handleCloseRechazada}
        handleCloseDetalle={handleCloseDetalle}
        openDetalle={openDetalle}
        solicitud={solicitud}
        updateSolicitudAprobada={updateSolicitudAprobada}
      />
    </div>
  );
};

export default ContentDetailsSolicitud;
