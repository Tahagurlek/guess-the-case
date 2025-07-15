import React from "react";
import {
  Dialog, DialogTitle, DialogContent, List, ListItem,
  ListItemButton, ListItemText
} from "@mui/material";

function CaseArchiveDialog({
  open, onClose, vakalar, lang, todayVaka, getSolvedCases, handleVakaSelect
}) {
  if (!vakalar) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{lang === "tr" ? "Arşiv" : "Archive"}</DialogTitle>
      <DialogContent>
        <List>
          {vakalar
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((vaka, idx) => {
              const solved = !!getSolvedCases()[vaka.date];
              return (
                <ListItem key={idx} disablePadding>
                  <ListItemButton onClick={() => handleVakaSelect(vaka)}>
                    <ListItemText
                      primary={
                        `${vaka.date} - ${vaka.chief_complaint[lang]}${
                          vaka.date === todayVaka.date
                            ? lang === "tr" ? " (Bugün)" : " (Today)"
                            : ""
                        }${solved ? " ✅" : ""}`
                      }
                      style={solved ? { color: "#4caf50" } : {}}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
        </List>
      </DialogContent>
    </Dialog>
  );
}

export default CaseArchiveDialog;
