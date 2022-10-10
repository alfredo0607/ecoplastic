import * as React from "react";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import {
  Typography,
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  Checkbox,
  TextField,
  Slider,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Autocomplete } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ViewFilterCard from "./ViewFilterCard";
import { getUserToken } from "../../../helpers/setGetToken";
import { fetchRequest, setRequestToken } from "../../../helpers/fetchRequest";

const useStyles = makeStyles((theme) => ({
  divider: {
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    marginBottom: 5,
  },
  buttons: {
    marginBottom: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: theme.spacing(1),
    "& button:first-child": {
      marginRight: theme.spacing(1),
    },
    position: "sticky",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
  titleBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      justifyContent: "center",
    },
  },
}));

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const { useEffect } = React;

const UsersFilters = ({
  setFiltersAndParams,
  setFiltered,
  setUserViews,
  userViews,
  setExcelMessages,
}) => {
  const classes = useStyles();

  const { register, control, handleSubmit, reset } = useForm();

  const handleApplyFilters = (data) => {
    setFiltered(true);
    setUserViews((prevState) => ({ ...prevState, active: false }));
    setFiltersAndParams({ ...data });
  };

  const handleClearForm = () => {
    reset(initialFilterValues);
    setFiltered(false);
    setUserViews((prevState) => ({ ...prevState, active: null }));
    setFiltersAndParams(initialFilterValues);
  };

  const handleClickView = (filters, id) => {
    setUserViews((prevState) => ({ ...prevState, active: id }));
    setFiltered(true);
    setFiltersAndParams({ ...filters });
  };

  const handleDeleteView = (id) => {
    setUserViews((prevState) => ({
      ...prevState,
      list: prevState.list.filter((item) => item.idVista !== id),
    }));
  };

  return (
    <>
      {userViews.list.length > 0 && (
        <>
          <Box className={classes.titleBar}>
            <Typography variant="h3" color="secondary">
              Vistas
            </Typography>
          </Box>

          <Divider style={{ marginTop: 10, marginBottom: 0 }} />

          <Box mb={1.2}>
            {userViews.list.map((item) => (
              <ViewFilterCard
                key={String(item.idVista)}
                id={item.idVista}
                name={item.nombreVista}
                filters={item.filtersString}
                handleClickView={handleClickView}
                handleDeleteView={handleDeleteView}
                setExcelMessages={setExcelMessages}
                activeView={userViews.active}
              />
            ))}
          </Box>
        </>
      )}

      <Box className={classes.titleBar}>
        <Typography variant="h3" color="secondary">
          Filtros
        </Typography>
      </Box>

      <Divider style={{ marginTop: 10, marginBottom: 0 }} />

      <form onSubmit={handleSubmit(handleApplyFilters)}>
        <Box mt={1}>
          <Controller
            name="rangoEdades"
            control={control}
            defaultValue={[null, null]}
            render={({ onChange, value, ref }) => (
              <>
                <Typography variant="h6" id="slider-rango-edades">
                  Rango de edad
                </Typography>
                <Slider
                  value={value}
                  onChange={(event, newValue) => onChange(newValue)}
                  valueLabelDisplay="auto"
                  aria-labelledby="slider-rango-edades"
                  getAriaValueText={(value) => `${value} años`}
                  min={18}
                  max={100}
                  // innerRef={ref}
                />
              </>
            )}
          />
        </Box>

        <Box mt={1}>
          <Controller
            name="genero"
            control={control}
            defaultValue=""
            render={({ onChange, value, ref }) => (
              <>
                <Typography variant="h6" className={classes.title}>
                  Genero
                </Typography>
                <FormControl fullWidth>
                  <Select
                    displayEmpty
                    fullWidth
                    defaultValue=""
                    id="genero-filtro"
                    variant="outlined"
                    margin="dense"
                    value={value}
                    onChange={onChange}
                    inputRef={ref}
                  >
                    <MenuItem value="" disabled>
                      Selecciona una opción
                    </MenuItem>
                    <MenuItem value="Masculino">Masculino</MenuItem>
                    <MenuItem value="Femenino">Femenino</MenuItem>
                    <MenuItem value="Otro">Otro</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
          />
        </Box>

        <Box mt={1}>
          <Controller
            name="inactivos"
            control={control}
            defaultValue={false}
            render={({ onChange, value, ref }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={value}
                    onChange={(e, checked) => onChange(checked)}
                    color="primary"
                  />
                }
                label="Incluir usuarios inactivos"
                ref={ref}
              />
            )}
          />
        </Box>

        <Box className={classes.buttons}>
          <Button
            variant="contained"
            disableElevation
            onClick={handleClearForm}
          >
            Limpiar
          </Button>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={!!userViews.active}
          >
            Filtrar
          </Button>
        </Box>
      </form>
    </>
  );
};

const initialFilterValues = {
  nombreCedula: "",
  experiencia: "",
  ciudad: "",
  localidad: "",
  hijos: "",
  rangoEdades: [null, null],
  estadoCivil: "",
  genero: "",
  cursos: [],
  formacionAcademica: "",
  psicofisico: "",
  medicos: "",
  tipoLibreta: "",
  inactivos: false,
  labelDocumento: "",
};

export default UsersFilters;
