import * as React from "react";
import * as b64ToBlob from "b64-to-blob";
import * as FileSaver from "file-saver";
import { useSelector } from "react-redux";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormGroup,
  Grid,
  Button,
  CircularProgress,
  Typography,
  Box,
  Snackbar,
} from "@mui/material";
import { Alert } from "@mui/material";
import GestionUsuarios from "./GestionUsuarios";
import Page from "../../../components/Page";
import LoadingForms from "../../../components/LoadingForms";
import { fetchRequest, setRequestToken } from "../../../helpers/fetchRequest";
import { getUserToken } from "../../../helpers/setGetToken";
import ShowUsuarios from "./ShowUsuarios";
import { generateExcelFile } from "../../../helpers/uploadExcelUsers";
const { useState } = React;

const Usuarios = () => {
  const {
    user: { usuario },
  } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [optionsModals, setOptionsModals] = useState({
    register: false,
    upload: false,
    download: false,
    downloadZip: false,
  });

  const [filtersData, setFiltersData] = useState(null);

  const [loadingExcel, setLoadingExcel] = useState({
    download: false,
    upload: false,
    downloadZip: false,
  });
  const [excelMessages, setExcelMessages] = useState({
    type: null,
    message: null,
    where: null,
  });

  const handleCloseModal = (key) => {
    setOptionsModals((prevState) => ({
      ...prevState,
      [key]: false,
    }));
  };

  const handleOpenModal = (key, data = null) => {
    setFiltersData(data);
    setOptionsModals((prevState) => ({
      ...prevState,
      [key]: true,
    }));
  };

  const handleChangeOption = (e) => {
    const checked = e.target.checked;
    const name = e.target.name;

    // setOptionsDownloadExcel((options) =>
    //   options.map((op) => {
    //     if (op.name === name) {
    //       return {
    //         ...op,
    //         [name]: checked,
    //       };
    //     }

    //     return op;
    //   })
    // );
  };

  const handleDownloadFile = async () => {
    setLoadingExcel((values) => ({ ...values, download: true }));

    try {
      const token = getUserToken();
      setRequestToken(token);

      const filter = {
        empresaID: usuario?.empresa?.idempresa,
        ...filtersData,
      };

      
      const response = await fetchRequest(
        `/users/obtener_usuarios_excel`,
        "POST",
        { dataFilters: filter }
      );

      const { results } = response.data.data;

      const fileName = filtersData
        ? "Usuarios operadores filtrados - EcoPlastic"
        : "Usuarios operadores - EcoPlastic";

      generateExcelFile({ csvData: results, fileName: fileName });
      setExcelMessages({
        type: "success",
        message: "Archivo generado correctamente",
        where: "download",
      });

      handleCloseModal("download");
    } catch (error) {
      let msg =
        "Ocurrio un error inesperado en la generacion del archivo, por favor intentalo de nuevo más tarde.";

      if (error.response?.status === 422) msg = error.response.data.errores;

      setExcelMessages({
        type: "error",
        message: msg,
        where: "download",
      });
    } finally {
      setLoadingExcel((values) => ({ ...values, download: false }));
    }
  };

  const handleCloseSnackbar = () =>
    setExcelMessages({ type: null, message: null, where: null });

  return (
    <Page title="Gestion de Usuarios">
      <Grid container spacing={3} justifyContent="center">
        <GestionUsuarios
          updateUsers={setUsers}
          excelMessages={excelMessages}
          handleOpenModal={handleOpenModal}
          handleCloseModal={handleCloseModal}
          optionsModals={optionsModals}
          handleCloseSnackbar={handleCloseSnackbar}
        />

        <ShowUsuarios
          usersList={users}
          setUsers={setUsers}
          handleOpenModal={handleOpenModal}
          setExcelMessages={setExcelMessages}
        />
      </Grid>

      {/* Modal Download Excel */}
      <Dialog
        fullWidth
        maxWidth="xs"
        open={optionsModals.download}
        onClose={() => handleCloseModal("download")}
        aria-labelledby="titulo-modal-formulario-excel"
        disableEscapeKeyDown={loadingExcel.download}
      >
        {loadingExcel.download && <LoadingForms />}

        <DialogTitle id="titulo-modal-formulario-excel">
          ¿Quieres generar un nuevo documento Excel?
          {filtersData && `(Usuarios filtrados)`}
        </DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          <FormControl component="fieldset">
            <FormGroup style={{ textAlign: "center" }}>
              <SaveAltIcon sx={{ fontSize: 100 }} />
            </FormGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => handleCloseModal("download")}
            autoFocus
          >
            Cerrar
          </Button>
          <Button color="primary" onClick={handleDownloadFile}>
            Generar archivo
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={optionsModals.downloadZip}
        onClose={() => handleCloseModal("downloadZip")}
        disableEscapeKeyDown
      >
        <Box p={2} display="flex" alignItems="center" flexDirection="column">
          <Typography align="center">Generando archivo comprimido</Typography>
          <CircularProgress />
        </Box>
      </Dialog>

      <Snackbar
        open={!!excelMessages.message}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={excelMessages.type || "success"}
        >
          {excelMessages.message || ""}
        </Alert>
      </Snackbar>
    </Page>
  );
};

export default Usuarios;
