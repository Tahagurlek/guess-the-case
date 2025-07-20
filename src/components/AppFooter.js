import React from "react";
import { Box, Typography } from "@mui/material";

export default function AppFooter() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        textAlign: "center",
        py: 2,
        mt: 7,
        color: theme => theme.palette.text.secondary,
        fontSize: { xs: "0.96rem", sm: "1.07rem" },
        background: theme => theme.palette.mode === "dark"
          ? "#23272b"
          : "#f6f7fb",
        borderTop: "1px solid #e0e0e0",
        letterSpacing: 0.1
      }}
    >
      2025 © Diagno — Developed by <b>İsmail Taha Gürlek</b>
    </Box>
  );
}
