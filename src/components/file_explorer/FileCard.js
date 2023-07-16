import * as React from "react";
import { areEqual } from "react-window";

import dayjs from "dayjs";
import es from "dayjs/locale/es";

import {
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  Box,
} from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import GetAppIcon from "@mui/icons-material/GetApp";
import ShareIcon from "@mui/icons-material/Share";
import CheckIcon from "@mui/icons-material/Check";
import StarIcon from "@mui/icons-material/Star";

import WordIcon from "mdi-material-ui/FileWord";

import PDFIcon from "mdi-material-ui/FileExcel";

import ExcelIcon from "mdi-material-ui/FileExcel";
import PowerPointIcon from "mdi-material-ui/FilePowerpoint";
import FileIcon from "mdi-material-ui/FileOutline";
import MediaIcon from "mdi-material-ui/Image";
import FolderZipIcon from "mdi-material-ui/FolderZip";

const useStyles = makeStyles((theme) => ({
  root: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "5px",
    overflow: "hidden",
    width: "100%",
    position: "relative",
    marginBottom: "10px",
    height: "153px",
    cursor: "pointer",
    transition: "all .3s ease",
    "&:nth-child(3n)": {
      marginRight: "0 !important",
    },
    "&:hover": {
      boxShadow: theme.shadows[2],
    },
  },
  thumnail: {
    backgroundColor:
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.03)"
        : "rgba(255, 255, 255, 0.02)",
    height: "100px",
    minHeight: "100px",
    width: "100%",
    color:
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.1)"
        : "rgba(255, 255, 255, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },
  content: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "5px",
  },
  icon: {
    fontSize: theme.spacing(4),
    display: "flex",
  },
  selected: {
    border: `2px solid ${theme.palette.secondary.main}`,
  },
  iconSelected: {
    position: "absolute",
    top: "5px",
    right: "5px",
    color: "#FFF",
    borderRadius: "50%",
    lineHeight: 0,
    padding: 2,
    backgroundColor: theme.palette.secondary.main,
  },
}));

const { useState, useRef } = React;

const FileCard = ({
  idFile,
  icon,
  fileName,
  serverName,
  thumnail,
  isImage,
  date,
  selected,
  favorite,
  handleClick,
  userID,
}) => {
  const classes = useStyles();
  const fileCardRef = useRef();

  const [anchorEl, setAnchorEl] = useState(null);

  const [openDialogShare, setOpenDialogShare] = useState(false);

  const handleOpenMenu = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleDownloadFile = () => {
    const a = document.createElement("a");
    a.href = serverName;
    a.download = fileName;
    a.target = "_blank";
    a.rel = "noopener noreferrer";

    fileCardRef.current.appendChild(a);
    a.click();
    fileCardRef.current.removeChild(a);

    handleCloseMenu();
  };

  const handleShareFile = () => {
    handleCloseMenu();
    setOpenDialogShare(true);
  };

  const handleCancelDialogShare = () => setOpenDialogShare(false);

  const handleCloseMenu = () => setAnchorEl(null);

  console.log(serverName);

  return (
    <>
      <div
        className={[classes.root, selected ? classes.selected : null].join(" ")}
        ref={fileCardRef}
      >
        {selected && (
          <div className={classes.iconSelected}>
            <CheckIcon fontSize="small" color="inherit" />
          </div>
        )}

        <div onClick={handleClick} className={classes.thumnail}>
          {isImage ? (
            <img src={serverName} alt={fileName} />
          ) : (
            <Typography variant="h2" color="inherit">
              {thumnail}
            </Typography>
          )}
        </div>
        <div className={classes.content}>
          <div onClick={handleClick} className={classes.icon}>
            {getIconFromExtension(icon)}
          </div>

          <div
            onClick={handleClick}
            style={{ overflow: "hidden", marginLeft: 5 }}
          >
            <Tooltip title={fileName}>
              <Typography style={{ whiteSpace: "nowrap" }} variant="body2">
                {fileName}
              </Typography>
            </Tooltip>
            <Typography variant="caption">
              {dayjs(date).locale(es).format("DD [de] MMMM [del] YYYY")}
            </Typography>
          </div>

          <IconButton
            size="small"
            style={{ marginLeft: "auto" }}
            onClick={handleOpenMenu}
          >
            <MoreVertIcon />
          </IconButton>
        </div>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={!!anchorEl}
          onClose={handleCloseMenu}
          getContentAnchorEl={null}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
          transformOrigin={{ horizontal: "right", vertical: "center" }}
        >
          <MenuItem onClick={handleDownloadFile}>
            <GetAppIcon fontSize="small" style={{ marginRight: 5 }} /> Descargar
          </MenuItem>
          <Box mt={1} mb={1}>
            <Divider />
          </Box>
          <MenuItem onClick={handleCloseMenu}>
            <StarIcon
              fontSize="small"
              style={{ marginRight: 5, color: "#ffe216" }}
            />{" "}
            {favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          </MenuItem>
          <MenuItem onClick={handleShareFile}>
            <ShareIcon
              fontSize="small"
              style={{ marginRight: 5, color: "#3498DB" }}
            />{" "}
            Compartir
          </MenuItem>
        </Menu>
      </div>
    </>
  );
};

const getIconFromExtension = (icon) => {
  const mediaExtensions = ["bmp", "gif", "jpg", "jpeg", "png"];
  const zipExtension = ["rar", "gzip", "zip"];
  const pdfExtensions = ["pdf"];
  const documentsExtensions = ["doc", "docm", "docx", "dotx", "dotm"];
  const excelExtensions = ["xlsx", "xlsb", "xls", "xlsm", "csv", "tsv"];
  const powerPointExtensions = [
    "potm",
    "potx",
    "ppam",
    "pps",
    "ppsx",
    "ppsm",
    "ppt",
    "pptm",
    "pptx",
  ];

  if (mediaExtensions.includes(icon))
    return <MediaIcon fontSize="inherit" style={{ color: "#7cafe3" }} />;

  if (zipExtension.includes(icon))
    return <FolderZipIcon fontSize="inherit" style={{ color: "#f3e751" }} />;

  if (pdfExtensions.includes(icon))
    return <PDFIcon fontSize="inherit" style={{ color: "#FF5722" }} />;

  if (documentsExtensions.includes(icon))
    return <WordIcon fontSize="inherit" style={{ color: "#3498DB" }} />;

  if (excelExtensions.includes(icon))
    return <ExcelIcon fontSize="inherit" style={{ color: "#388E3C" }} />;

  if (powerPointExtensions.includes(icon))
    return <PowerPointIcon fontSize="inherit" style={{ color: "#E74C3C" }} />;

  return <FileIcon fontSize="inherit" style={{ color: "#333333" }} />;
};

export default React.memo(FileCard, areEqual);
