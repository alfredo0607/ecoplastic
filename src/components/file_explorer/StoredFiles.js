import * as React from "react";
import { IconButton, Tooltip, Grid, Typography, Button } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Alert } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import FileCard from "./FileCard";
import FileCardSkeleton from "./FileCardSkeleton";
import { getExtensionsByName } from "../../util/getMimeTypesForFiles";
import { useFileExplorer } from "../../hooks/useFileExplorer";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    minHeight: "500px",
    height: "500px",
  },
  containerCards: {
    height: "440px",
    width: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    padding: "0 5px",
  },
  headerCards: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    marginTop: "10px",
  },
}));

const StoredFiles = ({
  userID,
  multiple,
  maxSelection,
  selected,
  setSelected,
  validTypes,
  explorerMode,
}) => {
  const classes = useStyles();

  const {
    files,
    loading,
    error,
    hasNextPage,
    search,
    setFiles,
    handleLoadMoreFiles,
    handleRefreshFiles,
    handleChangeExtensions,
    handleChangeSearch,
  } = useFileExplorer(userID, {
    limit: 10,
    shared: 0,
    extensions: validTypes.extensions,
  });

  const handleChangeCategory = (name) => {
    const extensions =
      name === "todos"
        ? validTypes.extensions
        : name === "favoritos"
        ? [...validTypes.extensions, "FAVORITOS"]
        : getExtensionsByName(name);

    handleChangeExtensions(extensions);
  };

  const handleSelectFile = (id) => {
    if (explorerMode === "paper") return;

    if (multiple) {
      const changeArrayItemsMultiple = (state) => {
        return state.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              selected: !item.selected,
            };
          }

          return item;
        });
      };

      setSelected((prevState) => prevState.filter((item) => item.id !== id));

      const existItem = selected.filter((item) => item.id === id)[0]
        ? true
        : false;

      if (selected.length !== maxSelection) {
        if (!existItem) {
          setSelected((prevState) => [
            ...prevState,
            files.filter((item) => item.id === id)[0],
          ]);
        }

        setFiles((prevState) => changeArrayItemsMultiple(prevState));
      } else {
        if (existItem) {
          setFiles((prevState) => changeArrayItemsMultiple(prevState));
        }
      }
    } else {
      const changeArrayItemsSingle = (state) => {
        return state.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              selected: !item.selected,
            };
          }

          return {
            ...item,
            selected: false,
          };
        });
      };

      setSelected(files.filter((item) => item.id === id));
      setFiles(changeArrayItemsSingle);
    }
  };

  return (
    <>
      <div className={classes.root}>
        <div style={{ width: "100%" }}>
          <div className={classes.headerCards}>
            <Tooltip title="Refrescar archivos">
              <IconButton
                size="small"
                style={{ marginLeft: "10px" }}
                disabled={!!error}
                onClick={handleRefreshFiles}
              >
                <CachedIcon />
              </IconButton>
            </Tooltip>
          </div>

          <div className={classes.containerCards}>
            <Grid container spacing={1}>
              {files.length === 0 && !error && (
                <Grid item xs={12}>
                  <Typography align="center">
                    No se encontrarón archivos
                  </Typography>
                </Grid>
              )}

              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}

              {files.map((option) => (
                <Grid key={option.id} item xs={12} md={6}>
                  <FileCard
                    idFile={option.id}
                    icon={option.icon}
                    fileName={option.fileName}
                    serverName={option.serverName}
                    thumnail={option.thumnail}
                    isImage={option.isImage}
                    date={option.date}
                    selected={option.selected}
                    favorite={option.favorite}
                    handleClick={() => handleSelectFile(option.id)}
                    userID={userID}
                  />
                </Grid>
              ))}

              {loading && (
                <>
                  <Grid item xs={12} md={6}>
                    <FileCardSkeleton />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FileCardSkeleton />
                  </Grid>
                </>
              )}

              {hasNextPage && (
                <Grid item xs={12}>
                  <Button fullWidth onClick={handleLoadMoreFiles}>
                    Cargar Más
                  </Button>
                </Grid>
              )}
            </Grid>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoredFiles;
