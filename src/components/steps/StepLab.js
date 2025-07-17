import { Box } from "@mui/material";

export default function StepLab({ data, lang }) {
  if (!data) return null;
  return (
    <Box>
      {/* Hemogram */}
      {data.hemogram && (
        <>
          <Box sx={{ fontWeight: 600, color: theme => theme.palette.text.primary, mt: 1 }}>
            {lang === "tr" ? "Hemogram:" : "Hemogram:"}
          </Box>
          <ul style={{ margin: "4px 0 8px 18px" }}>
            {Object.entries(data.hemogram).map(([k, v], i) => (
              <li key={i}>{k}: {v.value} <span style={{ color: "#888", fontSize: "0.96em" }}>({v.ref})</span></li>
            ))}
          </ul>
        </>
      )}
      {/* Biyokimya */}
      {data.biochemistry && data.biochemistry[lang] && (
        <>
          <Box sx={{ fontWeight: 600, color: theme => theme.palette.text.primary }}>
            {lang === "tr" ? "Biyokimya:" : "Biochemistry:"}
          </Box>
          <ul style={{ margin: "4px 0 8px 18px" }}>
            {Object.entries(data.biochemistry[lang]).map(([k, v], i) => (
              <li key={i}>{k}: {v.value} <span style={{ color: "#888", fontSize: "0.96em" }}>({v.ref})</span></li>
            ))}
          </ul>
        </>
      )}
      {/* İdrar */}
      {data.urinalysis && data.urinalysis[lang] && (
        <>
          <Box sx={{ fontWeight: 600, color: theme => theme.palette.text.primary }}>
            {lang === "tr" ? "İdrar:" : "Urinalysis:"}
          </Box>
          <ul style={{ margin: "4px 0 8px 18px" }}>
            {Object.entries(data.urinalysis[lang]).map(([k, v], i) => (
              <li key={i}>{k}: {v.value} <span style={{ color: "#888", fontSize: "0.96em" }}>({v.ref})</span></li>
            ))}
          </ul>
        </>
      )}
    </Box>
  );
}
