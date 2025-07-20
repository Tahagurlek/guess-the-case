import React from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@mui/material";

export default function ResultCard({
  result,
  selectedVaka,
  diagnosisDetail,
  lang = "tr"
}) {
  const theme = useTheme();
  if (!result) return null;

  const success = result.success;
  const isTr = lang === "tr";

  return (
    <Box sx={{ mt: 3 }}>
      {/* Sonuç kutusu */}
      <Box
        sx={{
          p: 2.2,
          borderRadius: 4,
          background: success
            ? (theme.palette.mode === "dark" ? "#1d3b2a" : "#e7ffe7")
            : (theme.palette.mode === "dark" ? "#422626" : "#ffeaea"),
          color: success
            ? (theme.palette.mode === "dark" ? "#aaffc3" : "#17652a")
            : (theme.palette.mode === "dark" ? "#ffbdbd" : "#c62828"),
          boxShadow: success
            ? (theme.palette.mode === "dark"
                ? "0 2px 14px #32ff3244"
                : "0 2px 18px #3cf14c22")
            : (theme.palette.mode === "dark"
                ? "0 2px 12px #e74d3c2c"
                : "0 2px 14px #ff787822"),
          mb: 2
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5, fontWeight: 800, fontSize: { xs: "1.12rem", sm: "1.16rem" } }}>
          {success ? (
            <CheckCircleIcon sx={{ mr: 1, fontSize: 27, color: "#25b246" }} />
          ) : (
            <ErrorOutlineIcon sx={{ mr: 1, fontSize: 27, color: "#e53935" }} />
          )}
          <span>
            {success
              ? isTr ? "Tebrikler! Doğru tanı." : "Congratulations! Correct diagnosis."
              : isTr ? "Üzgünüz, yanlış tanı." : "Sorry, wrong diagnosis."}
            {result.score !== undefined && (
              <>&nbsp;{isTr ? "Puanınız" : "Your score"}: <b>{result.score}</b></>
            )}
          </span>
        </Box>
        {/* Açıklama (her iki durumda da görünür) */}
        <Typography sx={{ mt: 1, fontWeight: 500 }}>
          <b>{isTr ? "Açıklama" : "Explanation"}:</b>{" "}
          {selectedVaka.explanation?.[lang]}
        </Typography>
        {/* Kaynak (varsa) */}
        {selectedVaka.references && (
          <Typography sx={{ mt: 1.2, fontWeight: 500 }}>
            <b>{isTr ? "Kaynak" : "Reference"}:</b>{" "}
            {(selectedVaka.references || []).map(r => r[lang]).join(", ")}
          </Typography>
        )}
        {/* Yanlış tanıda doğru tanı adı */}
        {!success && (
          <Typography sx={{ mt: 1, fontWeight: 500 }}>
            <b>{isTr ? "Doğru Tanı" : "Correct diagnosis"}:</b>{" "}
            {selectedVaka.correct_diagnosis?.[lang]}
          </Typography>
        )}
      </Box>

      {/* Tanı Bilgilendirme Akordiyonu */}
      {diagnosisDetail && (
        <Accordion
          sx={{
            borderRadius: 3,
            boxShadow: theme.palette.mode === "dark"
              ? "0 2px 14px #1976d221"
              : "0 2px 14px #1976d21A",
            background: theme.palette.mode === "dark"
              ? "#23272b"
              : "#f9fafd",
            ".MuiAccordionSummary-content": { alignItems: "center" }
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <InfoIcon sx={{ color: "#1976d2", mr: 1 }} />
            <b style={{ fontSize: "1.07rem" }}>{isTr ? "Tanı Bilgilendirme" : "Diagnosis Info"}</b>
          </AccordionSummary>
          <AccordionDetails>
            {/* Kısa açıklama */}
            {diagnosisDetail.short_info?.[lang] && (
              <Typography sx={{ mb: 1.5 }}>{diagnosisDetail.short_info[lang]}</Typography>
            )}
            {/* Olası Bulgular */}
            {diagnosisDetail.criteria?.[lang]?.length > 0 && (
              <Box sx={{ mb: 1 }}>
                <b>{isTr ? "Olası Bulgular" : "Possible Findings"}:</b>
                <ul>
                  {diagnosisDetail.criteria[lang].map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </Box>
            )}
            {/* Klinik pearl */}
            {diagnosisDetail.pearl?.[lang] && (
              <Typography sx={{ fontStyle: "italic", color: "#0b775b" }}>
                {diagnosisDetail.pearl[lang]}
              </Typography>
            )}
            {/* Kaynaklar */}
            {diagnosisDetail.references?.length > 0 && (
              <Typography sx={{ mt: 1.5, fontSize: "0.99rem", color: "#888" }}>
                <b>{isTr ? "Kaynaklar:" : "References:"}</b><br />
                {diagnosisDetail.references.map(r => r[lang]).join(", ")}
              </Typography>
            )}
            {/* Hiçbiri yoksa */}
            {!(
              diagnosisDetail.short_info?.[lang] ||
              (diagnosisDetail.criteria?.[lang]?.length > 0) ||
              diagnosisDetail.pearl?.[lang] ||
              (diagnosisDetail.references?.length > 0)
            ) && (
              <Typography sx={{ color: "#b71c1c", fontStyle: "italic" }}>
                {isTr ? "Bu tanı için ek bilgi bulunamadı." : "No additional information for this diagnosis."}
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
}
