import React, { useState, useRef } from "react";
import {
  Grid,
  InputAdornment,
  IconButton,
  TextField,
  Box,
  Pagination,
  Autocomplete,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import NoRows from "../../components/NoRows";
import PublicationCardAdmin from "./PublicationCardAdmin";

const PostCardList = (props) => {
  const timeoutRef = useRef(null);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [getTypesPublications, setGetTypesPublications] = useState([]);
  const [tagsPublications, setTagsPublications] = useState([]);
  const [searchQueryByName, setSearchQueryByName] = useState("");
  const [searchQueryByTags, setSearchQueryByTags] = useState([]);
  const [searchQueryByState, setSearchQueryByState] = useState(null);
  const [searchQueryByType, setSearchQueryByType] = useState(null);

  const handleChangeSearchByName = (e) => {
    const value = e.target.value;

    setSearchQueryByName(value);

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      props.setFiltersAndParams((filters) => ({
        ...filters,
        tituloPublicacion: value,
      }));
    }, 500);
  };

  const handleChangeSearchByTags = (valueInput) => {
    const value = valueInput;
    const dataSearch = value.map((value) => value.id);

    setSearchQueryByTags(value);

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      props.setFiltersAndParams((filters) => {
        return {
          ...filters,
          etiquetas: dataSearch,
        };
      });
    }, 500);
  };

  const handleChangeSearchByState = (valueInput) => {
    const value = valueInput;

    const dataFormated = value !== null ? value.id : null;

    setSearchQueryByState(dataFormated);

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      props.setFiltersAndParams((filters) => ({
        ...filters,
        estadoPublicacion: dataFormated,
      }));
    }, 500);
  };

  const handleChangeSearchByType = (valueInput) => {
    const value = valueInput;

    const dataFormated = value !== null ? value.idTipoPublicacion : null;

    setSearchQueryByType(value);

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      props.setFiltersAndParams((filters) => ({
        ...filters,
        tipoPublicacion: dataFormated,
      }));
    }, 500);
  };

  const handleChangeSearchByDate = (date) => {
    setSelectedDate(date);

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      props.setFiltersAndParams((filters) => ({
        ...filters,
        fechaPublicacion: date,
      }));
    }, 500);
  };

  const handleClearNameFilter = () => {
    setSearchQueryByName("");
    props.setFiltersAndParams((filters) => ({
      ...filters,
      tituloPublicacion: "",
    }));
  };

  return (
    <>
      <Grid
        container
        spacing={1}
        display="flex"
        alignItems="center"
        justifyContent={"space-between"}
        style={{ marginTop: "15px" }}
      >
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            placeholder="Busqueda rapida por titulo de publicacion"
            variant="outlined"
            spellCheck="false"
            value={searchQueryByName}
            onChange={handleChangeSearchByName}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    size="small"
                    aria-label="Limpiar caja de busqueda"
                    onClick={handleClearNameFilter}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon color="disabled" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Autocomplete
            multiple
            defaultValue={[]}
            variant="outlined"
            value={searchQueryByTags}
            options={tagsPublications}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => {
              handleChangeSearchByTags(newValue);
            }}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Busqueda por tags"
                placeholder="Tags"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <Autocomplete
            variant="outlined"
            id="combo-box-demo"
            options={getTypesPublications}
            getOptionLabel={(option) => option.nombreTipo}
            onChange={(event, newValue) => {
              handleChangeSearchByType(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filtrar por tipo"
                variant="outlined"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Autocomplete
            variant="outlined"
            options={states}
            onChange={(event, newValue) => {
              handleChangeSearchByState(newValue);
            }}
            getOptionLabel={(option) => option.status}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filtrar por estado"
                variant="outlined"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="dense"
              label="Filtrar por fecha"
              placeholder="Selecciona una fecha"
              value={selectedDate}
              onChange={handleChangeSearchByDate}
              // KeyboardButtonProps={{'aria-label': 'change date'}}
              renderInput={(params) => (
                <TextField {...params} variant="outlined">
                  {params.inputProps.endAdornment}
                </TextField>
              )}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
      <Box mt={2}>
        {props.publications.length > 0 ? (
          props.publications.map((publication) => (
            <PublicationCardAdmin
              key={publication.id}
              publication={publication}
              updateFormSettings={props.updateFormSettings}
            />
          ))
        ) : (
          <NoRows message="No hay contenido para mostrar aún"></NoRows>
        )}
      </Box>
      <Box mt={3} display="flex" justifyContent="center">
        <Pagination
          color="primary"
          count={Math.round(props.totalPublications / 10)}
          size="small"
          showFirstButton
          showLastButton
          onChange={(e, page) => props.setPage(page - 1)}
        />
      </Box>
    </>
  );
};

const states = [
  { status: "No publicado", id: 0 },
  { status: "Publicado", id: 1 },
];

export default PostCardList;
