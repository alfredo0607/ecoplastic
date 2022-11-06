import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  Box,
  Typography,
  Menu,
  MenuItem,
  Switch,
  Divider,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Card,
  useMediaQuery,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Grid,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import CommentIcon from "@mui/icons-material/Comment";
import Rating from "@material-ui/lab/Rating";

import { getUserToken } from "../../helpers/setGetToken";
import { fetchRequest, setRequestToken } from "../../helpers/fetchRequest";

const options = ["Editar", "Ver en detalle"];

const ITEM_HEIGHT = 40;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    justifyContent: "center",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },

  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  boxComponent: {
    marginTop: theme.spacing(1),
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  estadoTrueBox: {
    color: theme.palette.mode === "light" ? "white" : "black",
    backgroundColor: theme.palette.success.main,
  },
  estadoFalseBox: {
    color: theme.palette.mode === "light" ? "black" : "black",
    backgroundColor: "#e0e0e0",
  },
}));

function PublicationCardAdmin(props) {
  const matches = useMediaQuery("(max-width:500px)");
  const navigate = useNavigate();

  const classes = useStyles();

  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);

  const [switchState, setSwitchState] = useState(
    props.publication.publishSwitch === 0 ? 1 : 0
  );

  const [statusComentario, setstatusComentario] = useState(
    props.publication.iscommint === 1 ? 1 : 0
  );

  const [dialogCheckStatusComment, setDialogCheckStatusComment] =
    useState(false);

  const [dialogCheckStatus, setDialogCheckStatus] = useState(false);
  const [temporalStateSwitch] = useState(props.publication.publishSwitch);
  const [temporalStateSwitchComment] = useState(props.publication.iscommint);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const {
    user: { usuario },
  } = useSelector((state) => state.auth);

  const handleClickMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (option) => {
    if (option === "Editar") {
      props.updateFormSettings((state) => ({
        ...state,
        open: true,
        data: props.publication,
        type: "edit",
      }));
    } else {
      navigate(`../app/product/${props.publication.id}`);
    }
    handleCloseMenu();
  };

  /***************************************************************/

  const handleChangeSwitch = (e) => {
    if (e.target.checked === true) {
      setSwitchState(1);
    } else {
      setSwitchState(0);
    }
    setDialogCheckStatus(true);
  };

  const handleChangeSwitchComentario = (e) => {
    if (e.target.checked === true) {
      setstatusComentario(1);
    } else {
      setstatusComentario(0);
    }
    setDialogCheckStatusComment(true);
  };

  const cancelChangeStatus = () => {
    setSwitchState(temporalStateSwitch);
    dialogHandleClose();
  };

  const cancelChangeStatusComment = () => {
    setstatusComentario(temporalStateSwitchComment);
    dialogHandleCloseComment();
  };

  const dialogHandleClose = () => {
    setDialogCheckStatus(false);
  };

  const dialogHandleCloseComment = () => {
    setDialogCheckStatusComment(false);
  };

  const handleChangeStatus = async () => {
    setLoadingData(true);

    try {
      const token = getUserToken();

      setRequestToken(token);
      await fetchRequest(
        `/producto/ocultar_publicacion/${usuario.idUsuario}/${props.publication.id}`,
        "PUT",
        { newStatus: switchState === 0 ? 1 : 0 }
      );
    } catch (error) {
      let msg = error.response?.data.errores
        ? typeof error.response.data.errores === "string"
          ? error.response.data.errores
          : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde"
        : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde";

      setError(msg);
    } finally {
      setLoadingData(false);
    }
    dialogHandleClose();
  };

  /****************************************************************/

  const handleChangeStatusComent = async () => {
    setLoadingData(true);

    try {
      const token = getUserToken();

      setRequestToken(token);
      await fetchRequest(
        `/producto/desactivar_comentarios/${usuario.idUsuario}/${props.publication.id}`,
        "PUT",
        { newStatus: statusComentario }
      );
    } catch (error) {
      let msg = error.response?.data.errores
        ? typeof error.response.data.errores === "string"
          ? error.response.data.errores
          : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde"
        : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde";

      setError(msg);
    } finally {
      setLoadingData(false);
    }

    dialogHandleCloseComment();
  };

  return (
    <>
      <Box mt={3}>
        <Card style={{ padding: "0.5em", marginTop: "1em" }}>
          <CardHeader
            style={{
              height: "auto",
              display: "flex",
              flexDirection: matches ? "column" : "row",
            }}
            avatar={
              <Avatar
                aria-label="recipe"
                style={{ marginBottom: matches ? "10px" : "" }}
                src={`https://ecoplastic.herokuapp.com/uploads/images/imagenes_usuarios/${props.publication.avatar}`}
              />
            }
            action={
              <Box display="flex" flexDirection="row" alignItems="center">
                <CardActions>
                  <Typography variant="h5">Publicar: </Typography>
                  <Switch
                    name="field1"
                    checked={!!switchState}
                    onChange={handleChangeSwitch}
                  />
                </CardActions>
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleClickMenu}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  onClose={handleCloseMenu}
                  PaperProps={{
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5,
                      width: "20ch",
                    },
                  }}
                >
                  {options.map((option) => (
                    <MenuItem
                      key={option}
                      onClick={() => handleMenuItemClick(option)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            }
            title={
              <Typography variant="h4">
                {props.publication.publicationTitle}
              </Typography>
            }
            subheader={
              <Typography variant="h6">{props.publication.date}</Typography>
            }
          />
          <Divider />

          <CardContent
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "30px",
              height: "auto",
              width: "100%",
            }}
          >
            <Grid container>
              <Grid item md={2} xs={12} className={classes.boxComponent}>
                <Typography variant="h5">Categoria:</Typography>
                <Box>
                  <Typography variant="h6">
                    {props.publication.publicationType}
                  </Typography>
                </Box>
              </Grid>
              <Grid item md={2} xs={12} className={classes.boxComponent}>
                <Typography variant="h5">Estado actual:</Typography>

                <Box
                  className={
                    switchState ? classes.estadoTrueBox : classes.estadoFalseBox
                  }
                  display="flex"
                  justifyContent="center"
                  style={{ width: "100px", borderRadius: "15px" }}
                >
                  {switchState ? (
                    <Typography variant="h6">Publicado</Typography>
                  ) : (
                    <Typography variant="h6">No publicado</Typography>
                  )}
                </Box>
              </Grid>

              <Grid item md={3} xs={12} className={classes.boxComponent}>
                <Typography variant="h5">Publicado por:</Typography>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Typography variant="h6">
                    {props.publication.publicedBy}
                  </Typography>
                </Box>
              </Grid>

              <Grid item md={2} xs={12} className={classes.boxComponent}>
                <Typography variant="h5">Rating:</Typography>
                <Box>
                  <Rating
                    name="read-only"
                    value={props.publication.rating}
                    readOnly
                  />
                </Box>
              </Grid>

              <Grid item md={2} xs={12} className={classes.boxComponent}>
                <CardActions>
                  <Typography variant="h5">Comentarios: </Typography>
                  <Switch
                    name="field1"
                    checked={!!statusComentario}
                    onChange={handleChangeSwitchComentario}
                  />
                </CardActions>
              </Grid>

              <Grid item md={1} xs={12} className={classes.boxComponent}>
                {" "}
                <CommentIcon />
                <Box>
                  {" "}
                  <Typography variant="h6">
                    {props.publication.comments}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <Dialog open={dialogCheckStatus} onClose={dialogHandleClose}>
        <DialogTitle>{"ESTADO DE LA PUBLICACION"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            El estado actual de la publicacion es:
            {switchState === 0 ? " PUBLICADO" : " OCULTO"} ¿Realmente desea
            cambial el estado de esta publicacion a:
            {switchState !== 0 ? " PUBLICADO" : " OCULTO"}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelChangeStatus} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleChangeStatus} color="primary" autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={dialogCheckStatusComment}
        onClose={dialogHandleCloseComment}
      >
        <DialogTitle>{"DESACTIVAR COMENTARIOS"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            El estado actual de los comentarios es:
            {statusComentario !== 1 ? " ACTIVOS " : " DESACTIVADOS "} ¿Realmente
            desea cambial el estado de esta de los comentarios a:
            {statusComentario === 0 ? " DESACTIVADOS " : " ACTIVOS"}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelChangeStatusComment} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleChangeStatusComent} color="primary" autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PublicationCardAdmin;
