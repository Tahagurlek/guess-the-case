import React from "react";
import { Box, Typography } from "@mui/material";
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import PsychologyIcon from '@mui/icons-material/Psychology'; // Özgeçmiş/alışkanlık/ilaç
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew'; // Fizik muayene (kalp)
import BiotechIcon from '@mui/icons-material/Biotech'; // Laboratuvar (pipet)
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart'; // EKG & Görüntüleme
import TimelineIcon from '@mui/icons-material/Timeline'; // Klinik seyir (zaman çizgisi)

const icons = [
  <HistoryEduIcon color="primary" fontSize="large" />,             // Hikaye
  <PsychologyIcon sx={{ color: "#ef6c00" }} fontSize="large" />,   // Özgeçmiş/alışkanlık/ilaç
  <AccessibilityNewIcon color="error" fontSize="large" />,                 // Fizik muayene
  <BiotechIcon sx={{ color: "#43a047" }} fontSize="large" />,      // Laboratuvar
  <MonitorHeartIcon sx={{ color: "#1976d2" }} fontSize="large" />, // EKG & Görüntüleme
  <TimelineIcon sx={{ color: "#757575" }} fontSize="large" />      // Klinik seyir
];

export default function InfoStepCard({ item, idx, lang }) {
  return (
    <Box
      sx={{
        borderRadius: 3,
        background: theme => theme.palette.mode === "dark"
          ? (idx % 2 === 0 ? "#23272b" : "#202225")
          : (idx % 2 === 0 ? "#f5f5f5" : "#e3f2fd"),
        color: theme => theme.palette.text.primary,
        p: 2,
        mb: 2,
        boxShadow: "0 2px 8px #bdbdbd44",
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        transition: "background 0.5s"
      }}
    >
      <span style={{ marginTop: 4 }}>{icons[idx % icons.length]}</span>
      <Box>
        <Typography sx={{ fontWeight: 700, mb: 1 }}>{item.label[lang]}</Typography>
        <div>{item.value}</div>
      </Box>
    </Box>
  );
}
