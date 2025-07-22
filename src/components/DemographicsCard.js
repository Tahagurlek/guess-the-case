import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

export default function DemographicsCard({ selectedVaka, lang, vitals }) {
  const theme = useTheme();
  if (!selectedVaka) return null;
  return (
    <Box sx={{
      p: { xs: 1.7, sm: 2.5 },
      mb: 2.2,
      borderRadius: 3.5,
      background: theme => theme.palette.mode === "dark" ? "#23272b" : "#f9fafd",
      border: "1.1px solid #ececec",
      boxShadow: "0 2px 12px #dde2f822"
    }}>
      {/* Başlık ve ikon */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 1.15 }}>
        <PersonIcon sx={{
          color: "#1976d2",
          fontSize: 27,
          mr: 1.2
        }} />
        <Typography variant="h6" sx={{
          fontWeight: 700, fontSize: "1.2rem", letterSpacing: 0.06
        }}>
          {lang === "tr" ? "Demografi" : "Demographics"}
        </Typography>
      </Box>

      {/* Yaş / Cinsiyet */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 1 }}>
        <Box sx={{
          background: "#e3f2fd",
          color: "#1976d2",
          fontWeight: 600,
          fontSize: "1.03em",
          px: 1.3, py: 0.4,
          borderRadius: 2.4,
          display: "inline-block"
        }}>
          {lang === "tr" ? "Yaş:" : "Age:"} {selectedVaka.demographics.age}
        </Box>
        <Box sx={{
          background: "#e3f2fd",
          color: "#1976d2",
          fontWeight: 600,
          fontSize: "1.03em",
          px: 1.3, py: 0.4,
          borderRadius: 2.4,
          display: "inline-block"
        }}>
          {lang === "tr" ? "Cinsiyet:" : "Sex:"} {selectedVaka.demographics.sex[lang]}
        </Box>
      </Box>

      {/* Şikayet */}
      <Typography sx={{ mb: 1.1, fontSize: "1.08em" }}>
        <span style={{ fontWeight: 700, color: "#b48a00" }}>
          {lang === "tr" ? "Şikayet:" : "Complaint:"}
        </span>
        <span style={{
          fontWeight: 600,
          color: theme.palette.text.primary,
          marginLeft: 8
        }}>
          {selectedVaka.chief_complaint[lang]}
        </span>
      </Typography>

      {/* Vitaller: grid halinde */}
      <Box sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        gap: 1.1,
        fontSize: { xs: "1.05em", sm: "1.11em" },
        alignItems: "center"
      }}>
        {vitals && Object.entries(vitals).map(([k, v], i) => (
          <Box key={i} sx={{
            background: theme => theme.palette.mode === "dark" ? "#20232b" : "#f1f4f9",
            px: 1.6, py: 0.9,
            borderRadius: 2.2,
            mb: 0.4,
            display: "flex",
            alignItems: "center",
            fontWeight: 700,
            fontSize: "1.03em"
          }}>
            <span style={{ minWidth: 60 }}>{k}:</span>
            <span style={{ fontWeight: 600, marginLeft: 6 }}>{v}</span>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
