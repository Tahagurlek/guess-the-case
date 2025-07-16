import {
  Dialog, DialogTitle, DialogContent,
  List, ListItem, ListItemButton, ListItemText, Typography
} from "@mui/material";

export default function CaseArchiveDialog({ open, onClose, vakalar, getSolvedCases, setSelectedVaka, lang, todayVaka }) {
  const solvedCases = getSolvedCases();
  const solvedVakalar = vakalar.filter(vaka => solvedCases[vaka.date]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{lang === "tr" ? "Çözdüklerim" : "My Cases"}</DialogTitle>
      <DialogContent>
        {solvedVakalar.length === 0 && (
          <Typography sx={{ color: "gray" }}>
            {lang === "tr" ? "Henüz bir vaka çözmediniz." : "You haven't solved any cases yet."}
          </Typography>
        )}
        <List>
          {solvedVakalar
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((vaka, idx) => (
              <ListItem key={idx} disablePadding>
                <ListItemButton onClick={() => { setSelectedVaka(vaka); onClose(); }}>
                  <ListItemText
                    primary={
                      `${vaka.date} - ${vaka.chief_complaint[lang]}${
                        vaka.date === todayVaka.date
                          ? lang === "tr" ? " (Bugün)" : " (Today)"
                          : ""
                      } ✅`
                    }
                    style={{ color: "#4caf50" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
