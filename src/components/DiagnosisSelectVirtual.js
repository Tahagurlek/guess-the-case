import React, { useMemo } from "react";
import { Autocomplete, TextField, useTheme, Popper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FixedSizeList } from "react-window";

// Virtualized ListboxComponent
const LISTBOX_PADDING = 8; // px

function renderRow(props) {
  const { data, index, style } = props;
  const dataSet = data[index];
  return React.cloneElement(dataSet, {
    style: {
      ...style,
      top: style.top + LISTBOX_PADDING,
      margin: 0
    }
  });
}

const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData = React.Children.toArray(children);
  const theme = useTheme();
  const itemCount = itemData.length;
  const itemSize = 48; // px, option height

  const height = Math.min(7, itemCount) * itemSize + 2 * LISTBOX_PADDING;

  return (
    <div ref={ref} {...other}>
      <FixedSizeList
        height={height}
        width="100%"
        itemSize={itemSize}
        itemCount={itemCount}
        itemData={itemData}
        overscanCount={5}
        style={{
          padding: 0,
          background: theme.palette.mode === "dark" ? "#23272b" : "#fff"
        }}
      >
        {renderRow}
      </FixedSizeList>
    </div>
  );
});

export default function DiagnosisSelectVirtual({
  options,
  value,
  onChange,
  label = "Tanı seç veya ara",
  disabled = false,
  lang = "tr"
}) {
  const theme = useTheme();

  // Alphabetically sort options (isteğe bağlı)
  const sortedOptions = useMemo(() => [...options].sort(), [options]);

  return (
    <Autocomplete
      disableListWrap
      ListboxComponent={ListboxComponent}
      options={sortedOptions}
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
              fontSize: { xs: "1.09rem", sm: "1.13rem" },
              py: { xs: 1, sm: 1.15 }
            }
          }}
          sx={{
            borderRadius: 2.4,
            background: theme.palette.mode === "dark" ? "#23272b" : "#f7fafe",
            fontWeight: 500,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#b0b7c3"
            }
          }}
        />
      )}
      renderOption={(props, option) => {
  const { key, ...otherProps } = props;
  return (
    <li
      key={key}
      {...otherProps}
      style={{
        fontSize: "1.10rem",
        minHeight: 48,
        display: "flex",
        alignItems: "center",
        padding: "0 18px",
        borderBottom: "1px solid #f0f0f0",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }}
    >
      {option}
    </li>
  );
}}
      ListboxProps={{
        style: {
          padding: 0
        }
      }}
      sx={{
        mb: 2,
        width: "100%", left:0
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
