import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

export default function DemographicsCard({ selectedVaka, lang, vitals }) {
const theme = useTheme();
  if (!selectedVaka) return null;
  return (
    <Box sx={{
      p: { xs: 1.6, sm: 2.4 },
      mb: 2.2,
      borderRadius: 3.5,
      background: theme => theme.palette.mode === "dark"
        ? "#23272b"
        : "#f9fafd",
      border: "1.1px solid #ececec",
      boxShadow: "0 2px 12px #dde2f822"
    }}>
      {/* Başlık */}
      <Typography variant="h6" sx={{
        fontWeight: 800, mb: 1.1, fontSize: "1.19rem", letterSpacing: 0.05
      }}>
        {lang === "tr" ? "Kimlik Bilgileri & Şikayet" : "Demographics & Chief Complaint"}
      </Typography>
      {/* Yaş / Cinsiyet */}
      <Typography sx={{ mb: 0.3, fontSize: "1.07em" }}>
        <b>Yaş:</b> {selectedVaka.demographics.age}
        <span style={{ margin: "0 10px" }}>|</span>
        <b>Cinsiyet:</b> {selectedVaka.demographics.sex[lang]}
      </Typography>
      {/* Şikayet */}
      <Typography sx={{ mb: 1.1, fontSize: "1.07em" }}>
        <b style={{ color: "#b48a00" }}>{lang === "tr" ? "Şikayet:" : "Complaint:"}</b>
        <span style={{
          fontWeight: 600,
          color: theme.palette.text.primary,
          marginLeft: 7
        }}>
          {selectedVaka.chief_complaint[lang]}
        </span>
      </Typography>
      {/* Vitaller */}
      <Box sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        fontSize: { xs: "1.05em", sm: "1.11em" },
        alignItems: "center"
      }}>
        {vitals && Object.entries(vitals).map(([k, v], i) => (
          <span key={i} style={{
            marginRight: 14,
            marginBottom: 4
          }}>
            <b>{k}:</b> <span style={{ fontWeight: 600 }}>{v}</span>
          </span>
        ))}
      </Box>
    </Box>
  );
}
