import React from "react";
import { Box, Typography } from "@mui/material";
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import ScienceIcon from '@mui/icons-material/Science';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AssignmentIcon from '@mui/icons-material/Assignment';

const icons = [
  <HistoryEduIcon color="primary" fontSize="large"/>,
  <MedicalServicesIcon color="secondary" fontSize="large"/>,
  <ScienceIcon sx={{ color: "#43a047" }} fontSize="large"/>,
  <AssignmentIcon sx={{ color: "#6d4c41" }} fontSize="large"/>
];

function InfoStepCard({ item, idx, lang }) {
  if (!item) return null;
  return (
    <Box
      sx={{
        borderRadius: 3,
        background: idx % 2 === 0 ? "#f5f5f5" : "#e3f2fd",
        p: 2,
        mb: 2,
        boxShadow: "0 2px 8px #bdbdbd44",
        display: "flex",
        alignItems: "flex-start",
        gap: 2
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

export default InfoStepCard;
