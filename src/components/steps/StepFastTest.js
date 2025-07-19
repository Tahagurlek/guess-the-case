import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

function BloodGasGrid({ items }) {
  const theme = useTheme();
  return (
    <Box sx={{ my: 1.1 }}>
      {items.map(([k, v], i) => (
        <Box
          key={i}
          sx={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr 1.2fr",
            alignItems: "center",
            bgcolor: i % 2 === 0
              ? (theme.palette.mode === "dark" ? "#23272b" : "#FFFFFF")
              : "inherit",
            borderRadius: 1,
            px: 0.5,
            py: 0.5,
            mb: 0.2
          }}
        >
          <Box sx={{ fontWeight: 500 }}>{k}</Box>
          <Box sx={{ fontWeight: 700, textAlign: "right" }}>{v.value}</Box>
          <Box sx={{ color: "#888", fontSize: "0.95em", textAlign: "right", minWidth: 64 }}>{v.ref}</Box>
        </Box>
      ))}
    </Box>
  );
}

export default function StepFastTest({ data, lang }) {
  const theme = useTheme();
  if (!data) return null;
  return (
    <Box>
      {/* Kan Gazı */}
      {data.blood_gas && (
        <>
          <Box sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mt: 1,
            mb: 0.5,
            borderBottom: "1px solid #ffffff",
            fontSize: "1.09rem"
          }}>
            {lang === "tr" ? "Kan Gazı:" : "Blood Gas:"}
          </Box>
          <BloodGasGrid items={Object.entries(data.blood_gas)} />
        </>
      )}
      {/* EKG */}
      {data.ekg && data.ekg[lang] && (
        <>
          <Box sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mt: 1,
            mb: 0.3,
            borderBottom: "1px solid #ffffff",
            fontSize: "1.09rem"
          }}>
            EKG
          </Box>
          <Typography variant="body2" sx={{ ml: 2 }}>
            {data.ekg[lang]}
          </Typography>
        </>
      )}
      {/* Periferik Yayma */}
      {data.peripheral_smear && data.peripheral_smear[lang] && (
        <>
          <Box sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mt: 1,
            mb: 0.3,
            borderBottom: "1px solid #ffffff",
            fontSize: "1.09rem"
          }}>
            {lang === "tr" ? "Periferik Yayma:" : "Peripheral Smear:"}
          </Box>
          <Typography variant="body2" sx={{ ml: 2 }}>
            {data.peripheral_smear[lang]}
          </Typography>
        </>
      )}
    </Box>
  );
}
