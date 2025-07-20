import { Box, useTheme } from "@mui/material";
import React from "react";
function LabGrid({ items }) {
  const theme = useTheme();
  return (
    <Box sx={{ my: 1.2 }}>
      {items.map(([k, v], i) => (
         <Box
          key={i}
          sx={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1.2fr",
            alignItems: "center",
            bgcolor: i % 2 === 0
              ? (theme.palette.mode === "dark" ? "#23272b" : "#e8f0fe")
              : "inherit",
            borderRadius: 1,
            px: 0.5,
            py: { xs: 1.1, sm: 1.3 },    // <-- Satır arası çok daha ferah!
            mb: 0.4,                     // <-- Satırlar arası boşluk daha fazla!
            columnGap: 2                 // <-- Sütunlar arası daha geniş (isteğe bağlı)
          }}
        >
          <Box sx={{ fontWeight: 500 }}>{k}</Box>
          <Box sx={{ fontWeight: 700, textAlign: "right" }}>{v.value}</Box>
          <Box sx={{ color: "#bbb", fontSize: "0.91em", textAlign: "right", minWidth: 64 }}>{v.ref}</Box>
        </Box>
      ))}
    </Box>
  );
}

export default function StepLab({ data, lang }) {
  const theme = useTheme();
  if (!data) return null;

  return (
    <Box sx={{
  width: "100%",
  maxWidth: { xs: "100%", sm: 480 },
  mx: "auto",
  textAlign: "left",
  py: { xs: 0.8, sm: 0.5 },
  borderRadius: 3,
  boxShadow: "0 4px 16px #bbb3"
}}>
      {/* Hemogram */}
      {data.hemogram && (
        <>
          <Box sx={{
            fontWeight: 600, color: theme.palette.text.primary, mt: 1, mb: 0.3,
            borderBottom: "1px solid #ededed", fontSize: "1.09rem"
          }}>
            {lang === "tr" ? "Hemogram:" : "Hemogram:"}
          </Box>
          <LabGrid items={Object.entries(data.hemogram)} />
        </>
      )}
      {/* Biyokimya */}
      {data.biochemistry && data.biochemistry[lang] && (
        <>
          <Box sx={{
            fontWeight: 600, color: theme.palette.text.primary, mt: 1, mb: 0.3,
            borderBottom: "1px solid #ededed", fontSize: "1.09rem"
          }}>
            {lang === "tr" ? "Biyokimya:" : "Biochemistry:"}
          </Box>
          <LabGrid items={Object.entries(data.biochemistry[lang])} />
        </>
      )}
      {/* İdrar */}
      {data.urinalysis && data.urinalysis[lang] && (
        <>
          <Box sx={{
            fontWeight: 600, color: theme.palette.text.primary, mt: 1, mb: 0.3,
            borderBottom: "1px solid #e0e0e0", fontSize: "1.09rem"
          }}>
            {lang === "tr" ? "İdrar:" : "Urinalysis:"}
          </Box>
          <LabGrid items={Object.entries(data.urinalysis[lang])} />
        </>
      )}
    </Box>
  );
}
