import React from "react";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import { Button, Card, Typography, Chip } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { truncateString } from "../utils/truncateString";
import { Link } from "react-router-dom";

/* TODO: poner la funcionalidad del socket, para actualizar los mensajes y el estado */

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    padding: 10,
    cursor: "pointer",
    transition: "background .3s ease",
    marginBottom: "5px",
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "light"
          ? theme.palette.grey[200]
          : theme.palette.background.default,
    },
    "&:last-child": {
      marginBottom: 0,
    },
  },
  cardInsideContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  },
  estado: {
    fontSize: theme.spacing(1.7),
    padding: "5px 5px",
    borderRadius: "5px",
    width: "100px",
    textAlign: "center",
  },
  idSolicitud: {
    marginLeft: 15,
  },
  fechaSolicitud: {
    marginLeft: "auto",
    marginRight: 10,
  },
  datosSolicitud: {
    marginLeft: 15,
    marginRight: 15,
  },
  estadoSolicitudProceso: {
    backgroundColor: theme.palette.info.dark,
    color: "#fff",
  },
  estadoSolicitudRechazada: {
    backgroundColor: theme.palette.error.main,
    color: "#fff",
  },
  estadoSolicitudResuelta: {
    backgroundColor: theme.palette.success.main,
    color: "#fff",
  },
  containerRight: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    minWidth: 250,
  },
  areaContainer: {
    marginLeft: 5,
    "&:nth-child(-n + 3)": {
      marginLeft: 0,
    },
  },
}));

const CardSolicitud = ({ data }) => {
  const classes = useStyles();

  return (
    <>
      <Link to={`/app/detail_solicitudes/${data.idSolicitud}/${"user"}`}>
        <Card variant="outlined" className={classes.cardContainer}>
          <div className={classes.cardInsideContainer}>
            <Typography className={classes.idSolicitud} variant="h5">
              #{data.idSolicitud}
            </Typography>

            <div className={classes.datosSolicitud}>
              <Typography>{truncateString(data.mensaje, 80)}</Typography>
            </div>

            <div className={classes.containerRight}>
              <Typography className={classes.fechaSolicitud} variant="caption">
                {dayjs(data.createDate)
                  .locale(es)
                  .format("DD [de] MMMM [del] YYYY")}
              </Typography>

              <div
                className={[
                  classes.estado,
                  data.estado === "En revision"
                    ? classes.estadoSolicitudProceso
                    : data.estado === "Rechazada"
                    ? classes.estadoSolicitudRechazada
                    : classes.estadoSolicitudResuelta,
                ].join(" ")}
              >
                <Typography variant="inherit">{data.estado}</Typography>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </>
  );
};

export default CardSolicitud;
