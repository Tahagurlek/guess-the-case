import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, Typography, Box, Button, Divider, Snackbar, Chip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

function getTodayStr() {
  const today = new Date();
  const tzOff = today.getTimezoneOffset() * 60000;
  const localISO = new Date(today - tzOff).toISOString().slice(0, 10);
  return localISO;
}

export default function StatsDialog({ open, onClose, stats, lang }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [countdown, setCountdown] = useState("");

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

  const todayStr = getTodayStr();
  const showCountdown = stats.lastDate === todayStr;

  // İstatistik satırlarını badge/ikon ile ve net satır arasıyla gösteriyoruz.
  const statsRows = [
    {
      icon: <DoneAllIcon sx={{ color: "#1976d2", fontSize: 22 }} />,
      label: lang === "tr" ? "Çözülen vaka" : "Solved cases",
      value: stats.total
    },
    {
      icon: <EmojiEventsIcon sx={{ color: "#19c08a", fontSize: 22 }} />,
      label: lang === "tr" ? "Doğru" : "Correct",
      value: stats.correct
    },
    {
      icon: <ErrorOutlineIcon sx={{ color: "#d32f2f", fontSize: 22 }} />,
      label: lang === "tr" ? "Yanlış/Çözülemeyen" : "Incorrect/Failed",
      value: stats.incorrect
    },
    {
      icon: <QueryStatsIcon sx={{ color: "#fb8c00", fontSize: 22 }} />,
      label: lang === "tr" ? "Ortalama puan" : "Avg. score",
      value: stats.avgScore
    },
    {
      icon: <TrendingUpIcon sx={{ color: "#673ab7", fontSize: 22 }} />,
      label: lang === "tr" ? "Art arda gün" : "Streak",
      value: stats.streak
    },
  ];

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: "center", fontWeight: 700, pb: 1 }}>
        {lang === "tr" ? "Kişisel İstatistikler" : "Personal Stats"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ px: 1, pb: 1 }}>
          {statsRows.map((row, i) => (
            <Box key={row.label} sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.3,
              py: 1.1,
              px: 1,
              borderRadius: 2,
              bgcolor: i % 2 === 0 ? "rgba(25, 118, 210, 0.04)" : "rgba(240,240,240,0.11)",
              fontSize: "1.08rem",
              mb: 0.3
            }}>
              {row.icon}
              <Typography sx={{ flexGrow: 1 }}>{row.label}:</Typography>
              <Chip label={row.value} color="primary" size="small" sx={{ fontWeight: 700, fontSize: "1.03em" }} />
            </Box>
          ))}
        </Box>
        <Divider sx={{ my: 1.5 }} />
        <Box sx={{ my: 1.2, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            startIcon={<ContentCopyIcon />}
            onClick={handleShare}
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              py: 1,
              fontSize: "1.06rem",
              letterSpacing: 0.3
            }}
          >
            {lang === "tr" ? "Sonucumu Paylaş" : "Share My Result"}
          </Button>
        </Box>
        {showCountdown && countdown && (
          <Box sx={{
            mt: 2,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center"
          }}>
            <AccessTimeIcon sx={{ color: "#1976d2", mb: 0.5 }} />
            <Typography
              sx={{
                fontWeight: 600,
                textAlign: "center",
                color: "#1976d2",
                letterSpacing: 1,
                fontSize: "1.13rem"
              }}
            >
              {lang === "tr"
                ? `Sonraki Vaka: ${countdown}`
                : `Next case in: ${countdown}`}
            </Typography>
          </Box>
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={1800}
          onClose={() => setSnackbarOpen(false)}
          message={lang === "tr" ? "Panoya kopyalandı!" : "Copied to clipboard!"}
        />
      </DialogContent>
    </Dialog>
  );
}
