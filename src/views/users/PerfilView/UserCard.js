import * as React from "react";

import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import es from "dayjs/locale/es";

import { Box, IconButton, Typography, Avatar } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import clsx from "clsx";
import { Skeleton, Alert } from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ImageBackdrop from "../../../components/ImageBackdrop";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(0.5),
  },
  contentColumn: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  avatar: {
    width: theme.spacing(14),
    height: theme.spacing(14),
    cursor: "pointer",
  },
  aditionalInfo: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  badgePill: {
    padding: "2px",
    paddingLeft: "7px",
    paddingRight: "7px",
    borderRadius: theme.spacing(0.5),
    display: "block",
    lineHeight: 1,
    color: "white",
  },
  badgePillSuccess: {
    backgroundColor: theme.palette.success.main,
  },
  badgePillError: {
    backgroundColor: theme.palette.error.main,
  },
}));

const { useState } = React;

const UserCard = ({ loadingData, userInfo, errorLoading }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  console.log(userInfo);

  const { user } = useSelector((state) => state.auth);

  const [openBackdropImg, setOpenBackdropImg] = useState(false);

  const handleOpenBackdropImg = () => setOpenBackdropImg(true);

  const handleCloseBackdropImg = () => setOpenBackdropImg(false);

  return (
    <>
      <Box className={classes.header}>
        <IconButton size="small" onClick={() => navigate(`..`)}>
          <ArrowBackIcon />
        </IconButton>

        <div
          className={clsx(classes.badgePill, {
            [classes.badgePillSuccess]:
              userInfo?.usersDetails?.estadoUsuario === 1,
            [classes.badgePillError]:
              userInfo?.usersDetails?.estadoUsuario === 0,
          })}
        >
          <Typography variant="caption">
            {loadingData ? (
              <Skeleton animation="wave" variant="text" width={50} />
            ) : userInfo?.usersDetails?.estadoUsuario === 1 ? (
              "Habilitado"
            ) : (
              "Bloqueado"
            )}
          </Typography>
        </div>
      </Box>

      <Box className={classes.contentColumn}>
        {loadingData ? (
          <Skeleton
            animation="wave"
            variant="circular"
            className={classes.avatar}
          />
        ) : (
          <div className={classes.containerFlipImages}>
            <Avatar
              alt={userInfo.nombre}
              src={`http://localhost:3006/uploads/images/imagenes_usuarios/${userInfo?.usersDetails.userImage}`}
              className={classes.avatar}
              variant="circular"
              onClick={handleOpenBackdropImg}
            />
          </div>
        )}

        <Box className={classes.contentColumn} mt={1}>
          <Typography align="center" variant="h5">
            {loadingData ? (
              <Skeleton animation="wave" variant="text" width={200} />
            ) : (
              userInfo?.usersDetails.nombre
            )}
          </Typography>

          <Typography align="center" variant="h6" color="primary">
            {loadingData ? (
              <Skeleton animation="wave" variant="text" width={160} />
            ) : (
              userInfo.cargoLaboral
            )}
          </Typography>

          <Typography align="center" display="block" variant="caption">
            {loadingData ? (
              <Skeleton animation="wave" variant="text" width={160} />
            ) : (
              `C.C ${userInfo?.usersDetails.cedula}`
            )}
          </Typography>
        </Box>
      </Box>

      <Box className={classes.aditionalInfo}>
        <Typography display="block" variant="caption">
          {loadingData ? (
            <Skeleton animation="wave" variant="text" width={180} />
          ) : (
            <>
              <b>Último ingreso: </b>
              {userInfo?.usersDetails.lastLogin
                ? dayjs(userInfo?.usersDetails.lastLogin)
                    .locale(es)
                    .format("DD/MM/YYYY [-] hh:mm a")
                : "No Registrado"}
            </>
          )}
        </Typography>
      </Box>

      {errorLoading && (
        <Box width="100%" mt={1}>
          <Alert severity="error">{errorLoading}</Alert>
        </Box>
      )}

      <ImageBackdrop
        src={`http://localhost:3006/uploads/images/imagenes_usuarios/${userInfo?.usersDetails?.userImage}`}
        open={openBackdropImg}
        onClose={handleCloseBackdropImg}
        caption={`Imagen de perfil de: ${userInfo.nombre}`}
      />
    </>
  );
};

export default UserCard;
