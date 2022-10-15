import * as React from "react";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { getUserToken } from "../helpers/setGetToken";
import { fetchRequest, setRequestToken } from "../helpers/fetchRequest";

const AutocompleteWithRequest = ({
  label,
  placeholder,
  requestURL,
  variant = "outlined",
  margin = "dense",
  ...rest
}) => {
  const [options, setOptions] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getRequestItems = async () => {
    setLoading(true);

    try {
      const token = getUserToken();
      setRequestToken(token);

      const {
        data: { data },
      } = await fetchRequest(requestURL);

      setOptions(data.options);
    } catch (error) {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    } else {
      getRequestItems();
    }
  }, [open]);

  return (
    <Autocomplete
      {...rest}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => (option.title ? option.title : "")}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          margin={margin}
          label={label}
          placeholder={placeholder}
          variant={variant}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};

export default AutocompleteWithRequest;
