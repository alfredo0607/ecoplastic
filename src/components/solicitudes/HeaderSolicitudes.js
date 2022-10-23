import * as React from "react";
import {
  IconButton,
  Button,
  Collapse,
  Tooltip,
  Typography,
  Box,
  Grid,
  TextField,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Autocomplete } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UpdateIcon from "@mui/icons-material/Update";
import FilterListIcon from "@mui/icons-material/FilterList";
import HeaderFiltersSolicitudes from "./HeaderFiltersSolicitudes";

const useStyles = makeStyles((theme) => ({
  headerListaSolicitudes: {
    minHeight: "60px",
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: "0 10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  containerButtons: {
    display: "flex",
    alignItems: "center",
  },
}));

const { useState } = React;

const HeaderSolicitudes = ({
  show,
  filters,
  handleUpdateList,
  totalSolicitudes,
}) => {
  const classes = useStyles();

  const [openFilters, setOpenFilters] = useState(false);

  return (
    <div className={classes.headerListaSolicitudes}>
      <div className={classes.containerButtons}>
        {show && (
          <Tooltip title="Regresar a la lista">
            <IconButton
              size="small"
              // onClick={() => handleShowDetails({ empty: true })}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        )}

        {!show && (
          <Box ml={1} mr={1}>
            <Typography>Solicitudes: {totalSolicitudes}</Typography>
          </Box>
        )}

        {!show && (
          <Box ml={1} mr={1}>
            <Tooltip title="Refrescar lista">
              <IconButton size="small" onClick={() => handleUpdateList(0, 10)}>
                <UpdateIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {!show && (
          <Box ml={1} mr={1}>
            <Tooltip title="Filtrar lista">
              <IconButton
                size="small"
                onClick={() => setOpenFilters(!openFilters)}
              >
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </div>

      {!show && (
        <Collapse in={openFilters} unmountOnExit>
          <HeaderFiltersSolicitudes
            handleUpdateList={handleUpdateList}
            filters={filters}
          />
        </Collapse>
      )}
    </div>
  );
};

export default HeaderSolicitudes;
