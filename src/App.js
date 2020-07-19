/* eslint-disable no-use-before-define */
import React from "react";
import fetch from "cross-fetch";

import TextField from "@material-ui/core/TextField";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider
} from "@material-ui/core/styles";

import Autocomplete, {
  createFilterOptions
} from "@material-ui/lab/Autocomplete";
import { CircularProgress, CssBaseline, Paper } from "@material-ui/core";

const filter = createFilterOptions();
function sleep(delay = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}
const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});
const useStyles = makeStyles(theme => ({
  popper: {
    color: "white"
  }
}));

export default function FreeSoloCreateOption() {
  const classes = useStyles();
  const [value, setValue] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  console.log(options);
  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const response = await fetch(
        "https://country.register.gov.uk/records.json?page-size=5000"
      );
      await sleep(1e3); // For demo purposes.
      const countries = await response.json();

      if (active) {
        setOptions(Object.keys(countries).map(key => countries[key].item[0]));
      }
    })();
    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Paper>
        <Autocomplete
          classes={{ popper: classes.popper }}
          debug
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          open={open}
          value={value}
          onChange={(event, newValue) => {
            if (typeof newValue === "string") {
              setValue({
                title: newValue
              });
            } else if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              setValue({
                title: newValue.inputValue
              });
            } else {
              setValue(newValue);
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            // Suggest the creation of a new value
            if (params.inputValue !== "") {
              filtered.push({
                inputValue: params.inputValue,
                title: `Add "${params.inputValue}"`
              });
            }

            return filtered;
          }}
          id="free-solo-with-text-demo"
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={option => option.name}
          options={options}
          loading={loading}
          renderOption={option => option.name}
          style={{ width: 300 }}
          freeSolo
          renderInput={params => (
            <TextField
              {...params}
              label="Asynchronous"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                )
              }}
            />
          )}
        />
        {value && (
          <div>
            <p>{value.name}</p>
            <p>{value.country}</p>
            <p>{value["official-name"]}</p>
            <p>{value["citizen-names"]}</p>
          </div>
        )}
      </Paper>
    </ThemeProvider>
  );
}
