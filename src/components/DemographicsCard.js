import React from "react";
import { Box, Typography } from "@mui/material";

export default function DemographicsCard({ selectedVaka, lang, vitals }) {
  if (!selectedVaka) return null;
  return (
    <Box sx={{
      p: 2,
      mb: 2,
      borderRadius: 2,
      background: theme => theme.palette.mode === "dark"
        ? "linear-gradient(90deg,#23272b 60%,#202225 100%)"
        : "linear-gradient(90deg,#e3f2fd 60%,#fffde7 100%)",
      boxShadow: "0 2px 12px #bdbdbd55"
    }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        {lang === "tr" ? "Kimlik Bilgileri & Şikayet" : "Demographics & Chief Complaint"}
      </Typography>
      <Typography>
        <b>{lang === "tr" ? "Yaş" : "Age"}:</b> {selectedVaka.demographics.age}
        &nbsp;|&nbsp;
        <b>{lang === "tr" ? "Cinsiyet" : "Sex"}:</b> {selectedVaka.demographics.sex[lang]}
      </Typography>
      <Typography>
        <b>{lang === "tr" ? "Şikayet" : "Chief Complaint"}:</b> {selectedVaka.chief_complaint[lang]}
      </Typography>
      <Box sx={{
        mt: 1,
        p: 1,
        background: theme => theme.palette.mode === "dark" ? "#292929" : "#fffde7",
        borderRadius: 1,
        display: "flex",
        gap: 2,
        flexWrap: "wrap"
      }}>
        {vitals && Object.entries(vitals).map(([k, v], i) => (
          <Box key={i} sx={{ mr: 2 }}>
            <b>{k}:</b> {v}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
