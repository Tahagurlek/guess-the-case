import React from "react";
import {
  Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Typography
} from "@mui/material";

export default function DailyLeaderboardDialog({ open, onClose, date, lang }) {
  const board = React.useMemo(() => {
    if (!date) return [];
    return JSON.parse(localStorage.getItem(`leaderboard_daily_${date}`) || "[]")
      .sort((a, b) => b.score - a.score || a.time - b.time);
  }, [date, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {lang === "tr" ? "Günün Liderlik Tablosu" : "Today's Leaderboard"}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          {lang === "tr" ? "En yüksek puanlar:" : "Top scores:"}
        </Typography>
        {board.length === 0 ? (
          <Typography sx={{ color: "gray" }}>
            {lang === "tr" ? "Henüz kimse puan kaydetmedi." : "No scores yet."}
          </Typography>
        ) : (
          <List>
            {board.map((entry, idx) => (
              <ListItem key={idx}>
                <ListItemText
                  primary={`${idx + 1}. ${entry.nickname}`}
                  secondary={`${lang === "tr" ? "Puan:" : "Score:"} ${entry.score}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}
