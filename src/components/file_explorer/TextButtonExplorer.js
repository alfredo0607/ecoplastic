import * as React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import FileExplorer from ".";

const { useState } = React;

const getButtonColor = (color) =>
  ["primary", "secondary", "default"].includes(color) ? color : "default";

const TextButtonExplorer = ({
  textToShow,
  colorButton,
  mainFrame,
  ...rest
}) => {
  const { title, multiple, maxSelection, types, onEndSelected } = mainFrame;

  const [openMainFrame, setOpenMainFrame] = useState(false);

  const handleOpenMainFrame = () => setOpenMainFrame(true);

  const handleCloseMainFrame = () => setOpenMainFrame(false);

  const maxSelectionValid =
    maxSelection > 4 ? 4 : maxSelection < 1 ? 1 : maxSelection;

  return (
    <>
      <Button
        color={getButtonColor(colorButton)}
        size="small"
        variant="contained"
        {...rest}
        onClick={handleOpenMainFrame}
      >
        {textToShow}
      </Button>

      <FileExplorer
        open={openMainFrame}
        handleClose={handleCloseMainFrame}
        title={title}
        multiple={multiple}
        maxSelection={maxSelectionValid}
        types={types}
        mode="dialog"
        onEndSelected={onEndSelected}
      />
    </>
  );
};

TextButtonExplorer.propTypes = {
  textToShow: PropTypes.string,
  colorButton: PropTypes.oneOf(["primary", "secondary", "default"]),
  mainFrame: PropTypes.shape({
    title: PropTypes.string,
    multiple: PropTypes.bool,
    maxSelection: PropTypes.number,
    types: PropTypes.object,
    onEndSelected: PropTypes.func.isRequired,
  }),
};

TextButtonExplorer.defaultProps = {
  textToShow: "Seleccionar Archivo",
  colorButton: "default",
  mainFrame: {
    title: "Seleccionar archivo",
    multiple: false,
    maxSelection: 4,
    types: {
      extensions: [],
      mimeTypes: [],
      names: [],
    },
    onEndSelected: () => null,
  },
};

export default React.memo(TextButtonExplorer);
