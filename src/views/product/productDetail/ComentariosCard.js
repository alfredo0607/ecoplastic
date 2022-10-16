import React from "react";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import {
  Avatar,
  Badge,
  Card,
  CardContent,
  Typography,
  Rating,
  Divider,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const labels = {
  2.5: "Ok",
  3: "Ok+",
  3.5: "Bueno",
  4: "Bueno+",
  4.5: "Excelente",
  5: "Excelente+",
};

const getLabelText = (value) =>
  `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;

const useStyles = makeStyles((theme) => ({
  buttonExpand: {
    marginLeft: "auto",
  },
  cardContainer: {
    marginBottom: "15px",
    position: "relative",
    width: "100%",
  },
  cardContainer2: {
    marginBottom: "15px",
    position: "relative",
    width: "95%",
    margin: "0 auto",
  },
  tituloObservation: {
    display: "flex",
    alignItems: "center",
  },
  observationText: {
    marginTop: "10px",
    marginBottom: "0",
    color:
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.8)"
        : "rgba(255, 255, 255, 0.8)",
  },
  badgeState: {
    paddingLeft: "6px",
    paddingRight: "5px",
    paddingTop: "2px",
    paddingBottom: "2px",
    borderRadius: "7px",
    lineHeight: 1,
    marginRight: "5px",
    width: "100%",
    display: "flex",
    justifyContent: "end",
  },

  fechaText: {
    marginTop: "5px",
    marginBottom: "0",

    color:
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.8)"
        : "rgba(255, 255, 255, 0.8)",
  },
}));

const ComentariosCard = ({ data }) => {
  const classes = useStyles();

  return (
    <>
      <Card className={classes.cardContainer} variant="outlined">
        <CardContent>
          <div className={classes.tituloObservation}>
            <Avatar
              src={
                data.userImage
                  ? `http://localhost:3006/uploads/images/imagenes_usuarios/${data.userImage}`
                  : "/broken-image.jpg"
              }
            />

            <Typography marginLeft={2} width={"100%"} variant="caption">
              {data.nombre}
            </Typography>
          </div>

          <Divider variant="middle" />

          <Rating
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: 5,
            }}
            name="calification"
            value={data.calificacion}
            // onChange={(event, newRating) => handleRating(newRating)}
            precision={0.5}
            size="medium"
            max={5}
            getLabelText={getLabelText}
          />

          <Typography paragraph className={classes.observationText}>
            {data?.comentario}
          </Typography>

          <Typography paragraph className={classes.fechaText}>
            <Typography variant="caption">
              {dayjs(data?.createDate)
                .locale(es)
                .format("DD [de] MMMM [del] YYYY [a las] HH:mm")}
            </Typography>
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default ComentariosCard;
