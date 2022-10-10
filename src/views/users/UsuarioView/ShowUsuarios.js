import * as React from "react";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Button,
  ButtonGroup,
  Tooltip,
  alpha,
  InputAdornment,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Box,
  Typography,
  Grid,
  TextField,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Dialog,
  Checkbox,
} from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";
import { Alert } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import BlockIcon from "@mui/icons-material/Block";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import FilterListIcon from "@mui/icons-material/FilterList";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import ExcelIcon from "mdi-material-ui/FileExcel";
import TabIcon from "mdi-material-ui/TabPlus";
import FolderZipIcon from "mdi-material-ui/FolderZip";
import CreateIcon from "@mui/icons-material/Create";
import { getUserToken } from "../../../helpers/setGetToken";
import { fetchRequest, setRequestToken } from "../../../helpers/fetchRequest";
import LoadingForms from "../../../components/LoadingForms";
import UsersFilters from "./UsersFilters";

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.19),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "auto",
    },
    marginBottom: 15,
    color:
      theme.palette.mode === "light"
        ? "rgba(0,0,0,.7)"
        : "rgba(255,255,255,0.85)",
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.primary.main,
  },
  inputRoot: {
    color: "#115293",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
  chip: {
    padding: "0 5px",
    lineHeight: 1,
    display: "inline-block",
    borderRadius: 5,
  },
  chipActive: {
    backgroundColor: theme.palette.success.main,
    color: "white",
  },
  chipDisabled: {
    backgroundColor: theme.palette.text.disabled,
    color:
      theme.palette.mode === "light"
        ? "rgba(255, 255, 255, 0.8)"
        : "rgba(0, 0, 0, 0.8)",
  },
  containerUsers: {
    width: "100%",
  },
  filtersContainer: {
    width: "0",
    transition: "width .2s ease, padding .1s ease, height .2s ease",
    overflowX: "hidden",
    maxHeight: "710px",
    position: "relative",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      height: 0,
    },
  },
  filtersExpanded: {
    width: "380px",
    paddingRight: 20,
    marginRight: 20,
    paddingLeft: 10,
    borderRight: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down("lg")]: {
      width: "380px",
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
      height: "100%",
      marginBottom: 15,
      borderRight: `none`,
      borderBottom: `1px solid ${theme.palette.divider}`,
      paddingRight: 10,
      paddingBottom: 20,
      marginRight: 0,
    },
  },
  content: {
    padding: theme.spacing(2),
    display: "flex",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  },
  containerFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
    [theme.breakpoints.down("md")]: {
      flexDirection: "column-reverse",
    },
  },
  overlayFilters: {
    padding: theme.spacing(1),
    flex: 1,
    borderRight: `1px solid ${theme.palette.divider}`,
    marginRight: theme.spacing(1),
    paddingRight: theme.spacing(2),
    display: "flex",
    alignItems: "center",
  },
  excelDownload: {
    color: theme.palette.success.main,
    marginRight: theme.spacing(1),
  },
}));

const { useState, useEffect, useRef } = React;

function ShowUsuarios({
  usersList,
  setUsers,
  handleOpenModal,
  handleGenerateZipFile,
  setExcelMessages,
}) {
  const classes = useStyles();
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const dispatch = useDispatch();

  const {
    user: { usuario },
  } = useSelector((state) => state.auth);
  const { register, handleSubmit, errors } = useForm();

  const [filtersAndParams, setFiltersAndParams] = useState(initialFilterValues);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [loadingData, setLoadingData] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [checkedAll, setCheckedAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  const [openDialogVista, setOpenDialogVista] = useState(true);
  const [userViews, setUserViews] = useState({ active: false, list: [] });

  const [filtered, setFiltered] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);

  const getUsers = async () => {
    setLoadingData(true);

    try {
      const token = getUserToken();

      console.log(filtersAndParams);

      const filter = {
        empresaID: usuario?.empresa?.idempresa,
        ...filtersAndParams,
      };

      setRequestToken(token);
      const { data } = await fetchRequest(
        `users/obtener_usuarios?page=${page}&limit=${rowsPerPage}`,
        "POST",
        { filter }
      );
      const {
        data: { usuarios, total },
      } = data;

      const dataFormated = usuarios.map((usuario) => ({
        id: usuario.idusers,
        idUsuario: usuario.idusers,
        cedula: usuario.cedula,
        nombre: usuario.nombre,
        estado: usuario.estadoUsuario === 1 ? "Habilitado" : "Bloqueado",
        acciones: {
          idUsuario: usuario.idusers,
          estadoUsuario: usuario.estadoUsuario,
        },
        selected: checkedAll,
      }));

      setUsers(dataFormated);
      setTotalUsers(total);
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
  };

  const handleChangeSearch = (e) => {
    const value = e.target.value;

    setSearchQuery(value);

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setFiltersAndParams((filters) => ({
        ...filters,
        nombreCedula: value,
      }));
    }, 500);
  };

  const handleClearBoxSearch = () => {
    setSearchQuery("");
    setFiltersAndParams((filters) => ({
      ...filters,
      nombreCedula: "",
    }));
  };

  const handleSendView = async (data) => {
    try {
      const filtersString = JSON.stringify(filtersAndParams);
      const token = getUserToken();
      setRequestToken(token);

      const response = await fetchRequest(
        `/users/guardar_vista_usuario/${usuario.idUsuario}`,
        "POST",
        {
          name: data.nombre,
          seccion: "usuarios",
          filters: filtersString,
        }
      );

      const { view } = response.data.data;

      setUserViews((prevState) => ({
        ...prevState,
        list: [view, ...prevState.list],
      }));

      setOpenDialogVista(false);

      setExcelMessages({
        type: "success",
        message: "La vista se guardo correctamente",
        where: "nuevaVista",
      });
    } catch (error) {
      let msg =
        "Ocurrio un error inesperado en la generacion del archivo, por favor intentalo de nuevo más tarde.";

      if (error.response?.status === 422) msg = error.response.data.errores;

      setExcelMessages({
        type: "error",
        message: msg,
        where: "nuevaVista",
      });
    }
  };

  const handleChangeStatusUser = async (userID, oldStatus) => {
    const newStatus = oldStatus === "Habilitado" ? 0 : 1;

    try {
      const token = getUserToken();
      setRequestToken(token);

      const response = await fetchRequest(
        `/users/actualizar_estado_usuario/${userID}`,
        "PUT",
        { newState: newStatus }
      );

      const { message } = response.data.data;

      setExcelMessages({ type: "success", message });

      setUsers((prevState) =>
        prevState.map((user) => {
          if (user.id === userID) {
            return {
              ...user,
              estado: newStatus === 0 ? "Bloqueado" : "Habilitado",
            };
          }

          return user;
        })
      );
    } catch (error) {
      const msgError =
        typeof error === "string"
          ? error
          : "Ocurrio un error interno del servidor, por favor intentalo de nuevo más tarde";

      setExcelMessages({
        type: "error",
        message: msgError,
        where: "showUsers",
      });
    }
  };

  const handleCheckAll = (e) => {
    setCheckedAll(e.target.checked);
    setUsers((prevState) =>
      prevState.map((item) => ({ ...item, selected: e.target.checked }))
    );
  };

  const handleChangeRowChecked = (e, id) =>
    setUsers((prevState) =>
      prevState.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            selected: e.target.checked,
          };
        }

        return item;
      })
    );

  const handleChangeFiltersPanel = () => setOpenFilters(!openFilters);

  useEffect(() => {
    getUsers();
  }, [page, rowsPerPage, filtersAndParams]);

  useEffect(() => {
    // dispatch(startGetCursosSeleccion(0, 1000));
    // dispatch(startGetLabelsDocumentos(0, 1000));
  }, []);

  return (
    <Grid item xs={12}>
      <Paper className={classes.content}>
        {loadingData && <LoadingForms />}

        <div
          className={[
            classes.filtersContainer,
            openFilters ? classes.filtersExpanded : null,
          ].join(" ")}
        >
          <UsersFilters
            setFiltersAndParams={setFiltersAndParams}
            setFiltered={setFiltered}
            setUserViews={setUserViews}
            userViews={userViews}
            setExcelMessages={setExcelMessages}
          />
        </div>

        <div className={classes.containerUsers}>
          {error && <Alert severity="error">{error}</Alert>}

          <Box mb={2} display="flex" alignItems="center">
            <Box mr={2}>
              <Tooltip
                title={
                  openFilters.filters ? "Ocultar filtros" : "Abrir filtros"
                }
              >
                <IconButton
                  disabled={!!error}
                  size="small"
                  onClick={handleChangeFiltersPanel}
                >
                  <FilterListIcon color="action" />
                </IconButton>
              </Tooltip>
            </Box>

            <TextField
              fullWidth
              placeholder="Busqueda rapida por nombre o número de cédula"
              variant="outlined"
              margin="dense"
              spellCheck="false"
              value={searchQuery}
              onChange={handleChangeSearch}
              disabled={!!error}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      size="small"
                      aria-label="Limpiar caja de busqueda"
                      onClick={handleClearBoxSearch}
                      disabled={!!error}
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
          </Box>

          <TableContainer>
            <Table
              stickyHeader
              aria-label="Tabla del listado de usuarios"
              size="small"
            >
              <TableHead>
                <TableRow>
                  {filtered && (
                    <TableCell>
                      <Checkbox
                        checked={checkedAll}
                        onChange={handleCheckAll}
                        color="primary"
                        inputProps={{ "aria-label": "secondary checkbox" }}
                      />
                    </TableCell>
                  )}
                  <TableCell>ID</TableCell>
                  <TableCell>N° Cédula</TableCell>
                  <TableCell>Nombre Completo</TableCell>
                  <TableCell align="center">Rol</TableCell>
                  <TableCell align="center">Estado del usuario</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usersList.map((row) => {
                  const textButtonBlock =
                    row.estado === "Habilitado" ? "Bloquear" : "Habilitar";
                  const startIcon =
                    row.estado === "Habilitado" ? (
                      <BlockIcon fontSize="inherit" />
                    ) : (
                      <LockOpenIcon fontSize="inherit" />
                    );

                  return (
                    <TableRow hover key={String(row.id)}>
                      {filtered && (
                        <TableCell>
                          <Checkbox
                            checked={row.selected}
                            onChange={(e) => handleChangeRowChecked(e, row.id)}
                            color="primary"
                            inputProps={{ "aria-label": "secondary checkbox" }}
                          />
                        </TableCell>
                      )}
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell>
                        <b>{row.cedula}</b>
                      </TableCell>
                      <TableCell>{row.nombre}</TableCell>
                      <TableCell align="center">Operario</TableCell>
                      <TableCell align="center">
                        <div
                          className={[
                            classes.chip,
                            row.estado === "Habilitado"
                              ? classes.chipActive
                              : classes.chipDisabled,
                          ].join(" ")}
                        >
                          <Typography color="inherit" variant="caption">
                            {row.estado}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <ButtonGroup
                          variant="contained"
                          color="primary"
                          aria-label="Conjunto de botones con acciones para los usuarios"
                          disableElevation
                        >
                          <Tooltip title="Ir al perfil del usuario">
                            <Button
                              size="small"
                              startIcon={<AccountBoxIcon fontSize="inherit" />}
                              onClick={() =>
                                navigate(`../operators/${row.id}?tab=basica`)
                              }
                            >
                              Perfil
                            </Button>
                          </Tooltip>
                          {/* <Button size="small" disabled startIcon={startIcon}>
                            {textButtonBlock}
                          </Button> */}

                          <Tooltip title="Bloquear usuario">
                            <Button
                              style={
                                row.estado === "Habilitado"
                                  ? { backgroundColor: "red" }
                                  : { backgroundColor: "green" }
                              }
                              onClick={() =>
                                handleChangeStatusUser(row.id, row.estado)
                              }
                              size="small"
                              startIcon={startIcon}
                            >
                              {textButtonBlock}
                            </Button>
                          </Tooltip>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <div className={classes.containerFooter}>
            <div className={classes.overlayFilters}>
              {filtered && (
                <>
                  <Typography variant="body2">
                    Registros obtenidos: {totalUsers}
                  </Typography>

                  <Box ml="auto">
                    <IconButton
                      onClick={() =>
                        handleOpenModal("download", filtersAndParams)
                      }
                      size="small"
                      className={classes.excelDownload}
                    >
                      <Tooltip title="Exportar resultados en un archivo Excel">
                        <ExcelIcon color="inherit" />
                      </Tooltip>
                    </IconButton>
                  </Box>
                </>
              )}
            </div>

            <TablePagination
              rowsPerPageOptions={[15, 40, 60]}
              component="div"
              count={totalUsers}
              rowsPerPage={rowsPerPage}
              page={page}
              labelRowsPerPage={"Registros por página:"}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count !== -1 ? count : ` más de ${to}`}`
              }
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(e.target.value);
                setPage(0);
              }}
              ActionsComponent={TablePaginationActions}
            />
          </div>
        </div>
      </Paper>
    </Grid>
  );
}

const TablePaginationActions = (props) => {
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div style={{ flexShrink: 0, marginLeft: 15 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="Primera página"
        size="large"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="Página anterior"
        size="large"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Siguiente página"
        size="large"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Última página"
        size="large"
      >
        <LastPageIcon />
      </IconButton>
    </div>
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

export default ShowUsuarios;
