// DiagnosisSelect.js
import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function DiagnosisSelect({
  options,
  value,
  onChange,
  label = "Tanı seç veya ara",
  disabled = false,
  lang = "tr"
}) {
  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={onChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <SearchIcon sx={{ color: "action.active", mr: 1, my: "auto" }} />
                {params.InputProps.startAdornment}
              </>
            ),
            sx: {
              fontSize: { xs: "1.08rem", sm: "1.13rem" },
              py: { xs: 1.1, sm: 1.3 }
            }
          }}
          sx={{
            borderRadius: 2.4,
            background: theme => theme.palette.mode === "dark" ? "#23272b" : "#f7fafe",
            fontWeight: 500,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#b0b7c3"
            }
          }}
        />
      )}
      ListboxProps={{
        style: {
          maxHeight: 320,
          width: "100%",
          boxSizing: "border-box",
          fontSize: "1.13rem"
        }
      }}
      sx={{
        mb: 2,
        width: "100vw",
        "& .MuiAutocomplete-option": {
          fontSize: { xs: "1.01rem", sm: "1.13rem" },
          py: { xs: 1, sm: 1.2 },
          px: 2,
          borderBottom: "1px solid #f4f4f4",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minHeight: 44,
        }
      }}
      popupIcon={null}
      disableClearable={false}
      autoHighlight
      blurOnSelect
      fullWidth
      disablePortal
      disabled={disabled}
    />
  );
}
