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
  estadoSolicitud: {
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

const CardSolicitud = ({ solicitud, handleClickDetails }) => {
  const classes = useStyles();

  return (
    <>
      <Link to={`/app/detail_solicitudes/${1}/${"admin"}`}>
        <Card
          variant="outlined"
          // onClick={() => handleClickDetails({ empty: false })}
          className={classes.cardContainer}
        >
          <div className={classes.cardInsideContainer}>
            <Typography className={classes.idSolicitud} variant="h5">
              #1
            </Typography>

            <div className={classes.datosSolicitud}>
              {/* {solicitud.nombreEnvia && ( */}
              <Typography variant="h6">Alfredo Dominguez</Typography>
              {/* )} */}

              <Typography>
                {truncateString(
                  "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando",
                  80
                )}
              </Typography>

              <Chip
                key={String("1")}
                size="Small"
                variant="outlined"
                label={"Alfredo"}
                className={classes.areaContainer}
              />

              {/* {solicitud.areas && solicitud.areas.length > 0 && (
              <>
                {solicitud.areas.map((area) => (
                  <Chip
                    key={String(area.idArea)}
                    size="Small"
                    variant="outlined"
                    label={area.nombreArea}
                    className={classes.areaContainer}
                  />
                ))}
              </>
            )} */}
            </div>

            <div className={classes.containerRight}>
              <Typography className={classes.fechaSolicitud} variant="caption">
                {dayjs("2022/01/01")
                  .locale(es)
                  .format("DD [de] MMMM [del] YYYY")}
              </Typography>

              <div
                className={[
                  classes.estadoSolicitud,
                  // solicitud.estadoSolicitud === "EN PROCESO"
                  //   ? classes.estadoSolicitudProceso
                  //   : solicitud.estadoSolicitud === "RECHAZADA"
                  //   ? classes.estadoSolicitudRechazada
                  //   : classes.estadoSolicitudResuelta,
                ].join(" ")}
              >
                <Typography variant="inherit">RECHAZADA</Typography>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </>
  );
};

export default CardSolicitud;
