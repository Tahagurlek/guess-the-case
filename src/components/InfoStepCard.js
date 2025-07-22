import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import BiotechIcon from '@mui/icons-material/Biotech';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import TimelineIcon from '@mui/icons-material/Timeline';

const icons = [
  <HistoryEduIcon color="primary" fontSize="medium" />,
  <PsychologyIcon sx={{ color: "#ef6c00" }} fontSize="medium" />,
  <AccessibilityNewIcon color="error" fontSize="medium" />,
  <BiotechIcon sx={{ color: "#43a047" }} fontSize="medium" />,
  <MonitorHeartIcon sx={{ color: "#1976d2" }} fontSize="medium" />,
  <TimelineIcon sx={{ color: "#757575" }} fontSize="medium" />
];

export default function InfoStepCard({ item, idx, lang }) {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: idx * 0.08 }}
      sx={{
        borderRadius: 4,
        background: theme => theme.palette.mode === "dark"
  ? (idx % 2 === 0 ? "#252a31" : "#23272b")
  : (idx % 2 === 0 ? "#f8fafc" : "#e8f0fe"),
        color: theme => theme.palette.text.primary,
        p: 2.5,
        mb: 3,
        boxShadow: "0 4px 24px #bdbdbd22",
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        minHeight: 70,
      }}
    >
      <span style={{ marginTop: 4, flexShrink: 0 }}>{icons[idx % icons.length]}</span>
      <Box>
        <Typography sx={{ fontWeight: 700, fontSize: "1.2rem", mb: 1, letterSpacing: 0.1 }}>
          {item.label[lang]}
        </Typography>
        <div style={{ fontSize: "1.04rem", lineHeight: 1.7 }}>{item.value}</div>
      </Box>
    </Box>
  );
}
