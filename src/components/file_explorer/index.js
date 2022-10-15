import * as React from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  AppBar,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

//
import StoredFiles from "./StoredFiles";
import UploadFile from "./UploadFile";
import useFileUpload from "../../hooks/useFileUpload.js";
import LoadingForms from "../LoadingForms";

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-file-explorer-${index}`}
    aria-labelledby={`tab-file-explorer-${index}`}
    {...other}
  >
    {value === index && children}
  </div>
);

const a11yProps = (index) => ({
  id: `tabpanel-file-explorer-${index}`,
  "aria-controls": `tab-file-explorer-${index}`,
});

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    paddingTop: "8px !important",
  },
  header: {
    display: "flex",
    alignItems: "center",
  },
  close: {
    marginLeft: "auto",
  },
  appBar: {
    boxShadow: "none !important",
  },
  confirmSelectedContainer: {
    width: "100%",
    height: "40px",
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: theme.palette.primary.main,
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    padding: "0 15px",
  },
  paperContainer: {
    padding: "8px 24px",
    position: "relative",
    width: "100%",
  },
  contentPaper: {
    width: "100%",
    height: "100%",
  },
}));

const ModeViewExplorer = ({ children, mode, classes, ...rest }) => (
  <>
    {mode === "paper" ? (
      <Paper className={classes.paperContainer}>
        <div className={classes.contentPaper}>{children}</div>
      </Paper>
    ) : (
      <Dialog {...rest}>
        <DialogContent className={classes.dialogContent}>
          {children}
        </DialogContent>
      </Dialog>
    )}
  </>
);

const { useState } = React;

const FileExplorer = ({
  open,
  handleClose,
  title,
  multiple,
  maxSelection,
  types,
  onEndSelected,
  mode,
}) => {
  const classes = useStyles();

  const {
    user: { usuario },
  } = useSelector((state) => state.auth);

  const [valueTab, setValueTab] = useState(0);
  const [selected, setSelected] = useState([]);

  const { uploadFiles, progressUpload, errorUploading } = useFileUpload();

  const handleChangeTab = (event, newValue) => {
    setSelected([]);
    setValueTab(newValue);
  };

  const handleCloseAndClean = () => {
    setSelected([]);
    handleClose();
  };

  const handleEndSelected = () => {
    if (valueTab === 1) {
      const cleanedFiles = selected.map((item) => item.file);
      const url = `users/subir_archivo_explorador_archivos/${usuario?.idUsuario}`;

      const formData = new FormData();

      for (const file of cleanedFiles) formData.append("archivos", file);

      formData.append("referencia", "archivos_file_explorer_usuario_upload");
      formData.append("directorio", "file_explorer_usuarios");
      formData.append("favorito", 0);
      formData.append("compartido", 0);
      formData.append("idCompartidoPor", null);

      uploadFiles(url, formData, ({ registro }) => {
        handleCloseAndClean();
        if (mode !== "paper") onEndSelected(registro);
      });
    } else {
      const newSelected = selected;

      handleCloseAndClean();
      if (mode !== "paper") onEndSelected(newSelected);
    }
  };

  return (
    <ModeViewExplorer
      classes={classes}
      mode={mode}
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleCloseAndClean}
      disableBackdropClick={progressUpload > 0}
      disableEscapeKeyDown={progressUpload > 0}
    >
      {progressUpload > 0 && <LoadingForms value={progressUpload} />}

      <div className={classes.header}>
        <Typography variant="h4">
          {title}
          {multiple && mode !== "paper" && (
            <Typography variant="caption" display="block">
              Seleccion Multiple (Max. {maxSelection})
            </Typography>
          )}
        </Typography>
        {mode !== "paper" && (
          <IconButton
            className={classes.close}
            onClick={handleCloseAndClean}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        )}
      </div>

      <Box mt={1} mb={2}>
        <AppBar
          position="static"
          color="transparent"
          className={classes.appBar}
        >
          <Tabs
            value={valueTab}
            onChange={handleChangeTab}
            aria-label="Tabs Explorados de Archivos"
          >
            <Tab label="Mis Archivos" {...a11yProps(0)} />
            <Tab label="Subir" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={valueTab} index={0}>
          <StoredFiles
            multiple={multiple}
            maxSelection={maxSelection}
            selected={selected}
            setSelected={setSelected}
            validTypes={types}
            userID={usuario?.idUsuario}
            explorerMode={mode}
          />
        </TabPanel>
        <TabPanel value={valueTab} index={1}>
          <UploadFile
            multiple={multiple}
            maxSelection={maxSelection}
            validTypes={types}
            setSelected={setSelected}
            explorerMode={mode}
          />
        </TabPanel>
      </Box>

      {selected.length > 0 && (
        <div className={classes.confirmSelectedContainer}>
          <Typography variant="h6" color="textSecondary">
            {selected.length === 1
              ? selected[0].fileName
              : `${selected.length} archivos seleccionados`}
          </Typography>

          <Box ml="auto">
            <IconButton size="small" onClick={handleEndSelected}>
              <SendIcon style={{ color: "#fff" }} />
            </IconButton>
          </Box>
        </div>
      )}
    </ModeViewExplorer>
  );
};

export default FileExplorer;
