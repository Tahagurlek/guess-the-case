import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, Typography, Box, Button, Snackbar } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

function getTodayStr() {
  const today = new Date();
  const tzOff = today.getTimezoneOffset() * 60000;
  const localISO = new Date(today - tzOff).toISOString().slice(0, 10);
  return localISO;
}

export default function StatsDialog({ open, onClose, stats, lang }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [countdown, setCountdown] = useState("");

  // Geri sayım güncelleyici
  useEffect(() => {
    if (!open) return;
    function updateCountdown() {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow - now;
      if (diff > 0) {
        const hours = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, "0");
        const mins = String(Math.floor(diff / 1000 / 60) % 60).padStart(2, "0");
        const secs = String(Math.floor(diff / 1000) % 60).padStart(2, "0");
        setCountdown(`${hours}:${mins}:${secs}`);
      } else {
        setCountdown("");
      }
    }
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [open]);

  const handleShare = () => {
    let streakMsg = lang === "tr"
      ? `Seri: ${stats.streak} gün`
      : `Streak: ${stats.streak} days`;
    let shareMsg = "";
    if (stats.lastResult) {
      const triesUsed = stats.lastResult.tries ?? "-";
      const solved = stats.lastResult.success;
      shareMsg = lang === "tr"
        ? `VAKA TAHMİN ${stats.lastDate}\n${solved ? "✅" : "❌"} Puan: ${stats.lastResult.message.match(/\d+/)?.[0] || "-"}\n${solved ? triesUsed + ". denemede bildim!" : "Çözülemedi!"}\n${streakMsg}\nRumuz: ${localStorage.getItem("nickname") || ""}`
        : `GUESS THE CASE ${stats.lastDate}\n${solved ? "✅" : "❌"} Score: ${stats.lastResult.message.match(/\d+/)?.[0] || "-"}\n${solved ? `Solved in ${triesUsed}. try!` : "Failed!"}\n${streakMsg}\nNickname: ${localStorage.getItem("nickname") || ""}`;
    } else {
      shareMsg = lang === "tr"
        ? "Bugün çözülmüş bir vaka yok!"
        : "No solved case for today!";
    }
    navigator.clipboard.writeText(shareMsg);
    setSnackbarOpen(true);
  };

  // Geri sayım sadece bugünkü vaka çözülmüşse gösterilsin
  const todayStr = getTodayStr();
  const showCountdown = stats.lastDate === todayStr;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{lang === "tr" ? "Kişisel İstatistikler" : "Personal Stats"}</DialogTitle>
      <DialogContent>
        <Typography>
          {lang === "tr" ? "Çözülen vaka:" : "Solved cases:"} {stats.total}
        </Typography>
        <Typography>
          {lang === "tr" ? "Doğru:" : "Correct:"} {stats.correct}
        </Typography>
        <Typography>
          {lang === "tr" ? "Yanlış/Çözülemeyen:" : "Incorrect/Failed:"} {stats.incorrect}
        </Typography>
        <Typography>
          {lang === "tr" ? "Ortalama puan:" : "Avg. score:"} {stats.avgScore}
        </Typography>
        <Typography>
          {lang === "tr" ? "Art arda gün (Streak):" : "Streak:"} {stats.streak}
        </Typography>
        <Box sx={{ my: 2, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            startIcon={<ContentCopyIcon />}
            onClick={handleShare}
            sx={{ fontWeight: 700 }}
          >
            {lang === "tr" ? "Sonucumu Paylaş" : "Share My Result"}
          </Button>
        </Box>
        {showCountdown && countdown && (
          <Typography
            sx={{
              mt: 2,
              fontWeight: 600,
              textAlign: "center",
              color: "#1976d2",
              letterSpacing: 1,
              fontSize: "1.08rem"
            }}
          >
            {lang === "tr"
              ? `Sonraki Vaka: ${countdown}`
              : `Next case in: ${countdown}`}
          </Typography>
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          message={lang === "tr" ? "Panoya kopyalandı!" : "Copied to clipboard!"}
        />
      </DialogContent>
    </Dialog>
  );
}
