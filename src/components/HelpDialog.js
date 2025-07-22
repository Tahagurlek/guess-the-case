import React from "react";
import {
  Dialog, DialogTitle, DialogContent, Typography, Box, Divider
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export default function HelpDialog({ open, onClose, lang }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: 540,
          borderRadius: 4.2
        }
      }}
    >
      <DialogTitle sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.1,
        fontWeight: 800,
        fontSize: "1.18rem"
      }}>
        <HelpOutlineIcon color="primary" sx={{ fontSize: 26, mb: "-3px" }} />
        {lang === "tr" ? "Yardım & Bilgilendirme" : "Help & Info"}
      </DialogTitle>
      <DialogContent sx={{ pt: 1, pb: 3, px: { xs: 2, sm: 3 }, overflowY: "auto" }}>
        {/* Diagno Nedir? */}
        <Box sx={{
          mb: 2.1,
        }}>
          <Typography sx={{ fontWeight: 700, mb: 0.6, fontSize: "1.08rem" }}>
            {lang === "tr" ? "Diagno Nedir?" : "What is Diagno?"}
          </Typography>
          <Typography sx={{
            color: "text.secondary",
            fontSize: "1rem",
            lineHeight: 1.6,
            fontWeight: 500,
            pl: 0 // Tam sola dayalı
          }}>
            {lang === "tr"
              ? "Diagno; tıp öğrencileri ve doktorlar için hazırlanmış, günlük tıbbi vakalar üzerinden tanı koyma becerini geliştirmene yardımcı olan interaktif bir oyundur. Her gün yeni bir vaka ile, en az bilgiyle doğru tanıya ulaşmaya çalış!"
              : "Diagno is an interactive game designed for medical students and doctors to improve diagnostic reasoning skills through daily clinical cases. Try to reach the correct diagnosis with minimal information every day!"}
          </Typography>
        </Box>
<Divider sx={{ my: 1.7 }} />
        {/* Kurallar */}
        <Typography sx={{ fontWeight: 700, mb: 1, color: "primary.main", fontSize: "1.1rem" }}>
          {lang === "tr" ? "Kurallar" : "Rules"}
        </Typography>
        <Box component="ul" sx={{ mb: 2.3, pl: 3, color: "text.primary", fontSize: "1.02rem" }}>
          <li>{lang === "tr" ? "Her gün yeni bir vaka seni bekliyor." : "A new clinical case awaits you every day."}</li>
          <li>{lang === "tr" ? "Başlangıçta sadece temel bilgiler (yaş, cinsiyet, şikayet) görünür." : "Only basic info (age, sex, chief complaint) is shown at first."}</li>
          <li>{lang === "tr" ? "Tanıyı ilk tahmininde bulursan en yüksek puanı alırsın." : "Guessing the diagnosis on your first try gives the highest score."}</li>
          <li>{lang === "tr" ? "Her yanlış tahmin ve ek bilgi açmak puanını azaltır." : "Each wrong guess and extra info reveal reduces your score."}</li>
          <li>{lang === "tr" ? "Her vaka için 5 deneme hakkın var." : "You have 5 tries per case."}</li>
          <li>{lang === "tr" ? "Doğru tanıya ulaşınca vaka açıklamasını ve kaynakları görebilirsin." : "Find the correct diagnosis to view explanations and references."}</li>
        </Box>
        <Divider sx={{ my: 1.7 }} />
        {/* Puanlama */}
        <Typography sx={{ fontWeight: 700, mb: 1, color: "secondary.main", fontSize: "1.09rem", display: "flex", alignItems: "center", gap: 1 }}>
          <StarIcon fontSize="small" />
          {lang === "tr" ? "Puanlama" : "Scoring"}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2"><b>{lang === "tr" ? "Başlangıç:" : "Start:"}</b> 100</Typography>
          <Typography variant="body2"><b>{lang === "tr" ? "Her yanlış tahmin:" : "Each wrong guess:"}</b> -10</Typography>
          <Typography variant="body2">
            <b>
              {lang === "tr"
                ? "Her yeni bölüm açma"
                : "Each info section reveal"}
              :
            </b>
            {" "}
            -20{" "}
            <span style={{ color: "#999", fontSize: "0.97em", fontWeight: 400 }}>
              {lang === "tr"
                ? "(vakadan vakaya değişiklik gösterebilir)"
                : "(may vary by case)"}
            </span>
          </Typography>
        </Box>
        <Divider sx={{ my: 1.7 }} />
        {/* Hedef */}
        <Typography sx={{ fontWeight: 700, mb: 1, color: "success.main", fontSize: "1.07rem", display: "flex", alignItems: "center", gap: 1 }}>
          <EmojiEventsIcon fontSize="small" />
          {lang === "tr" ? "Amaç" : "Goal"}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {lang === "tr"
            ? "En az bilgiyle, en kısa sürede ve en az denemeyle doğru tanıyı bul! Skorun, istatistiklerin ve liderlik tablosunda yerini belirler."
            : "Solve the case with minimum info and fewest tries for the highest score! Your score determines your rank on the leaderboard."}
        </Typography>
        <Box sx={{ mt: 2.5 }}>
          <Typography variant="caption" color="text.secondary">
            {lang === "tr"
              ? "Geri bildirim ve öneriler için menüyü kullanabilirsin."
              : "For feedback and suggestions, use the menu."}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
