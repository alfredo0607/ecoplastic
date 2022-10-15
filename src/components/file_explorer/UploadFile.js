import * as React from "react";
import { v4 as uuid } from "uuid";

import makeStyles from "@mui/styles/makeStyles";

import {
  AttachFile,
  Description,
  PictureAsPdf,
  Theaters,
} from "@mui/icons-material";

import { DropzoneAreaBase } from "react-mui-dropzone";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
    minHeight: "500px",
    height: "500px",
    maxHeight: "500px",
  },
  dropzone: {
    height: "100%",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const handlePreviewIcon = (fileObject, classes) => {
  const { type } = fileObject.file;
  const iconProps = {
    className: classes.image,
  };

  if (type.startsWith("video/")) return <Theaters {...iconProps} />;

  if (type.startsWith("image/"))
    return <img {...iconProps} src={fileObject.data} />;

  switch (type) {
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return <Description {...iconProps} />;
    case "application/pdf":
      return <PictureAsPdf {...iconProps} />;
    default:
      return <AttachFile {...iconProps} />;
  }
};

const { useState } = React;

const UploadFile = ({ multiple, maxSelection, validTypes, setSelected }) => {
  const classes = useStyles();

  const [droppedFiles, setDroppedFiles] = useState([]);

  const handleDropFile = (newFiles) => {
    if (multiple && droppedFiles.length < maxSelection) {
      const filesFormated = newFiles.map((item) => ({
        ...item,
        id: uuid(),
        fileName: item.file.name,
      }));

      const setFiles = (prevState) => [...prevState, ...filesFormated];

      setDroppedFiles(setFiles);
      setSelected(setFiles);
    }

    if (!multiple) {
      const fileFormated = newFiles.map((item) => ({
        ...item,
        id: uuid(),
        fileName: item.file.name,
      }));

      setDroppedFiles(fileFormated);
      setSelected(fileFormated);
    }
  };

  const messageFileRejected = (rejectedFile, acceptedFiles, maxFileSize) => {
    let message = "";

    const { name, size, type } = rejectedFile;

    if (size > maxFileSize)
      message = `El archivo ${name} supera el limite de peso permitido: 20mb`;

    if (!acceptedFiles.includes(type))
      message = `El tipos de archivo de ${name} no esta permitido`;

    return message;
  };

  const handleDeleteFile = (deleteFile, index) => {
    const itemInfo = droppedFiles[index];

    let itemsCopy = [...droppedFiles];
    itemsCopy.splice(index, 1);

    setSelected((files) => files.filter((item) => item.id !== itemInfo.id));
    setDroppedFiles([...itemsCopy]);
  };

  return (
    <div className={classes.root}>
      <DropzoneAreaBase
        showPreviewsInDropzone
        fileObjects={droppedFiles}
        showFileNames={true}
        filesLimit={multiple ? maxSelection : 1}
        dropzoneClass={classes.dropzone}
        dropzoneText={"Arrastra y suelta un archivo aqui o haz click"}
        previewText={"Vista previa: "}
        acceptedFiles={validTypes.mimeTypes}
        maxFileSize={20971520}
        getFileAddedMessage={(fileName) =>
          `El archivo ${fileName} fue añadido, `
        }
        getFileRemovedMessage={(fileName) =>
          `El archivo ${fileName} fue removido`
        }
        getFileLimitExceedMessage={(filesLimit) =>
          `El maximo de archivos permitidos es ${filesLimit}`
        }
        getDropRejectMessage={messageFileRejected}
        getPreviewIcon={handlePreviewIcon}
        onAdd={handleDropFile}
        onDelete={handleDeleteFile}
      />
    </div>
  );
};

export default UploadFile;
