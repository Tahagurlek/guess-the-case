import { Box, Typography } from "@mui/material";

export default function StepFastTest({ data, lang }) {
  if (!data) return null;
  return (
    <Box>
      {/* Kan Gazı */}
      {data.blood_gas && (
        <>
          <Box sx={{ fontWeight: 600, color: theme => theme.palette.text.primary, mt: 1 }}>
            {lang === "tr" ? "Kan Gazı:" : "Blood Gas:"}
          </Box>
          <ul style={{ margin: "4px 0 8px 18px" }}>
            {Object.entries(data.blood_gas).map(([k, v], i) => (
              <li key={i}>{k}: {v.value} <span style={{ color: "#888", fontSize: "0.96em" }}>({v.ref})</span></li>
            ))}
          </ul>
        </>
      )}
      {/* EKG */}
      {data.ekg && data.ekg[lang] && (
        <>
          <Box sx={{ fontWeight: 600, color: theme => theme.palette.text.primary }}>
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
          <Box sx={{ fontWeight: 600, color: theme => theme.palette.text.primary }}>
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
