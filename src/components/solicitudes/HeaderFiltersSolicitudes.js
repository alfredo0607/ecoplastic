import * as React from "react";
import { Button, Typography, Box, TextField } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Autocomplete } from "@mui/material";
//import { KeyboardDatePicker } from "@material-ui/pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FilterIcon from "mdi-material-ui/Filter";
import FilterRemoveIcon from "mdi-material-ui/FilterRemove";
import dayjs from "dayjs";
import AutocompleteWithRequest from "../AutocompleteWithRequest";

const useStyles = makeStyles((theme) => ({
  containerFilters: {
    width: "100%",
    border: `2px dashed ${theme.palette.divider}`,
    borderRadius: "5px",
    padding: "15px 20px",
    marginTop: 5,
    marginBottom: 10,
  },
  rowCustom: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "5px",
    marginBottom: "5px",
    "& > div": {
      width: "49%",
    },
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      "& > div": {
        width: "100%",
      },
    },
  },
  rowButtonsCustom: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    "& button:first-child": {
      marginRight: 10,
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      "& button": {
        width: "100%",
        marginBottom: "10px",
      },
      "& button:first-child": {
        marginRight: 0,
      },
    },
  },
}));

const { useReducer } = React;

const initialState = {
  search: "",
  tags: [],
  typeSolicitud: [],
  stateSolicitud: null,
  areas: [],
  userSolicitud: null,
  dateCreation: null,
  dateFinished: null,
};

const HeaderFiltersSolicitudes = ({ filters, handleUpdateList }) => {
  const classes = useStyles();

  const [state, dispatch] = useReducer(filtersReducer, initialState);

  const handleChangeTextField = ({ target }) =>
    dispatch({ type: "UPDATED_SEARCH", payload: target.value });

  const handleChangeAutocomplete = (e, newValue, type) =>
    dispatch({ type, payload: newValue });

  const handleChangeDates = (newDate, type) =>
    dispatch({ type, payload: newDate });

  const handleClearFilters = () => {
    dispatch({ type: "RESET_STATE" });
    handleUpdateList(0, 10, null);
  };

  const handleSendFilters = () => {
    const objectFiltersData = {
      ...state,
      tags: state.tags.map((item) => item.id),
      typeSolicitud: state.typeSolicitud.map((item) => item.id),
      areas: state.areas.map((item) => item.id),
      stateSolicitud: state.stateSolicitud ? state.stateSolicitud.title : null,
      userSolicitud: state.userSolicitud ? state.userSolicitud.id : null,
    };

    handleUpdateList(0, 10, objectFiltersData);
  };

  return (
    <div className={classes.containerFilters}>
      <Typography variant="h4">Filtros</Typography>

      {/* Search by key words */}
      {filters.busqueda && (
        <Box>
          <TextField
            fullWidth
            value={state.search}
            onChange={handleChangeTextField}
            margin="dense"
            variant="outlined"
            label="Busqueda"
            placeholder={`Busca por #ID de solicitud${
              filters.tags ? ", nombre de quien envia .." : ""
            }`}
            helperText="Si deseas buscar por ID debes incluir '#' antes del id. p.e.j: #1"
          />
        </Box>
      )}

      {filters.tags && (
        <Box>
          <AutocompleteWithRequest
            multiple
            filterSelectedOptions
            limitTags={3}
            ChipProps={{ size: "small" }}
            value={state.tags}
            onChange={(event, newValue) =>
              handleChangeAutocomplete(event, newValue, "UPDATED_TAGS")
            }
            label="Etiquetas, tags"
            noOptionsText="No se encontraron registros"
            placeholder="Pertenece a alguna de las etiquetas seleccionadas"
            requestURL={`/utils/obtener_lista_tags_solicitud`}
          />
        </Box>
      )}

      <Box className={classes.rowCustom}>
        {filters.tipoSolicitud && (
          <AutocompleteWithRequest
            multiple
            filterSelectedOptions
            limitTags={3}
            ChipProps={{ size: "small" }}
            value={state.typeSolicitud}
            onChange={(event, newValue) =>
              handleChangeAutocomplete(
                event,
                newValue,
                "UPDATED_TYPE_SOLICITUD"
              )
            }
            label="Tipos de solicitud"
            placeholder="Tipos de solicitud"
            noOptionsText="No se encontraron registros"
            requestURL={`/utils/obtener_lista_tipos_solicitud`}
          />
        )}

        {filters.estado && (
          <Autocomplete
            value={state.stateSolicitud}
            onChange={(event, newValue) =>
              handleChangeAutocomplete(
                event,
                newValue,
                "UPDATED_STATE_SOLICITUD"
              )
            }
            options={optionsTipoEstado}
            isOptionEqualToValue={(option, value) =>
              option.title === value.title
            }
            getOptionLabel={(option) => (option.title ? option.title : "")}
            noOptionsText="No se encontraron registros"
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="dense"
                label="Estado de solicitud"
                placeholder="Estado actual de la solicitud"
                variant="outlined"
              />
            )}
          />
        )}
      </Box>

      <Box className={classes.rowCustom}>
        {filters.areas && (
          <AutocompleteWithRequest
            multiple
            filterSelectedOptions
            limitTags={3}
            ChipProps={{ size: "small" }}
            value={state.areas}
            onChange={(event, newValue) =>
              handleChangeAutocomplete(
                event,
                newValue,
                "UPDATED_AREAS_SOLICITUD"
              )
            }
            label="Areas participantes"
            noOptionsText="No se encontraron registros"
            placeholder="Areas participantes"
            requestURL={`/utils/obtener_lista_areas`}
          />
        )}

        {filters.usuarios && (
          <AutocompleteWithRequest
            value={state.userSolicitud}
            onChange={(event, newValue) =>
              handleChangeAutocomplete(
                event,
                newValue,
                "UPDATED_USER_SOLICITUD"
              )
            }
            label="Usuario Encargado"
            noOptionsText="No se encontraron registros"
            placeholder="Usuario participando en la solicitud"
            requestURL={`/utils/obtener_lista_usuarios_administradores`}
          />
        )}
      </Box>

      <Box className={classes.rowCustom}>
        <DatePicker
          views={["day", "month", "year"]}
          label="Fecha de creación"
          value={state.dateCreation}
          defaultValue="null"
          onChange={(value) =>
            handleChangeDates(value, "UPDATED_DATE_CREATED_SOLICITUD")
          }
          renderInput={(params) => (
            <TextField
              {...params}
              helperText={params?.inputProps?.placeholder}
            />
          )}
        />

        <DatePicker
          label="Fecha de cierre"
          value={state.dateFinished}
          onChange={(value) =>
            handleChangeDates(value, "UPDATED_DATE_FINISHED_SOLICITUD")
          }
          views={["day", "month", "year"]}
          renderInput={(params) => (
            <TextField
              {...params}
              helperText={params?.inputProps?.placeholder}
            />
          )}
        />
      </Box>

      <Box className={classes.rowButtonsCustom}>
        <Button
          disableElevation
          variant="contained"
          color="secondary"
          startIcon={<FilterRemoveIcon />}
          onClick={handleClearFilters}
        >
          Limpiar Filtros
        </Button>
        <Button
          disableElevation
          variant="contained"
          color="primary"
          startIcon={<FilterIcon />}
          onClick={handleSendFilters}
        >
          Aplicar Filtros
        </Button>
      </Box>
    </div>
  );
};

const filtersReducer = (state, { type, payload }) => {
  if (type === "UPDATED_SEARCH") {
    return {
      ...state,
      search: payload,
    };
  }

  if (type === "UPDATED_TAGS") {
    return {
      ...state,
      tags: payload,
    };
  }

  if (type === "UPDATED_TYPE_SOLICITUD") {
    return {
      ...state,
      typeSolicitud: payload,
    };
  }

  if (type === "UPDATED_STATE_SOLICITUD") {
    return {
      ...state,
      stateSolicitud: payload,
    };
  }

  if (type === "UPDATED_AREAS_SOLICITUD") {
    return {
      ...state,
      areas: payload,
    };
  }

  if (type === "UPDATED_USER_SOLICITUD") {
    return {
      ...state,
      userSolicitud: payload,
    };
  }

  if (type === "UPDATED_DATE_CREATED_SOLICITUD") {
    return {
      ...state,
      dateCreation: payload,
    };
  }

  if (type === "UPDATED_DATE_FINISHED_SOLICITUD") {
    return {
      ...state,
      dateFinished: payload,
    };
  }

  if (type === "RESET_STATE") {
    return {
      ...state,
      ...initialState,
    };
  }

  return state;
};

const optionsTipoEstado = [
  { title: "EN PROCESO" },
  { title: "RESUELTA" },
  { title: "RECHAZADA" },
];

export default HeaderFiltersSolicitudes;
