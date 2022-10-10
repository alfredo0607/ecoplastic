import * as React from "react";

import { Typography, IconButton } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import clsx from "clsx";

import DeleteIcon from "@mui/icons-material/Delete";
import { getUserToken } from "../../../helpers/setGetToken";
import { fetchRequest, setRequestToken } from "../../../helpers/fetchRequest";

const useStyles = makeStyles((theme) => ({
  containerView: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(0.5),
    padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
    cursor: "pointer",
    position: "relative",
    marginTop: theme.spacing(1),
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: theme.palette.divider,
      borderLeft: `3px solid ${theme.palette.primary.main}`,
    },
    "&:hover div": {
      display: "block",
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 5,
    },
  },
  viewDelete: {
    display: "none",
  },
  activeView: {
    borderLeft: `3px solid ${theme.palette.primary.main}`,
  },
}));

const ViewFilterCard = ({
  id,
  name,
  filters,
  handleClickView,
  handleDeleteView,
  activeView,
  setExcelMessages,
}) => {
  const classes = useStyles();

  const handleApplyFilters = () => {
    const filtersParsed = JSON.parse(JSON.parse(filters));
    handleClickView(filtersParsed, id);
  };

  const handleDeleteViewDB = async (e) => {
    e.stopPropagation();

    try {
      const token = getUserToken();
      setRequestToken(token);

      const response = await fetchRequest(
        `/users/eliminar_vista_usuario/${id}`,
        "DELETE",
        {}
      );
      const { message } = response.data.data;

      handleDeleteView(id);

      setExcelMessages({
        type: "success",
        message,
        where: "viewCard",
      });
    } catch (error) {
      const msgError =
        typeof error === "string"
          ? error
          : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde";

      setExcelMessages({
        type: "error",
        message: msgError,
        where: "viewCard",
      });
    }
  };

  return (
    <div
      onClick={handleApplyFilters}
      className={clsx(classes.containerView, {
        [classes.activeView]: activeView === id,
      })}
    >
      <Typography>{name}</Typography>
      <div className={classes.viewDelete}>
        <IconButton onClick={handleDeleteViewDB} size="small">
          <DeleteIcon color="error" />
        </IconButton>
      </div>
    </div>
  );
};

export default ViewFilterCard;
