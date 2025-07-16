import React from "react";
import { Dialog, DialogTitle, DialogContent, Typography, Box } from "@mui/material";

export default function HelpDialog({ open, onClose, lang }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {lang === "tr" ? "Nasıl Oynanır?" : "How to Play?"}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2, fontWeight: 600 }}>
          {lang === "tr" ? "Oyun Kuralları" : "Game Rules"}
        </Typography>
        <ul>
          <li>
            {lang === "tr"
              ? "Her gün yeni bir vaka seni bekliyor."
              : "Every day a new clinical case awaits you."}
          </li>
          <li>
            {lang === "tr"
              ? "İlk ekranda sadece temel bilgiler (yaş, cinsiyet, şikayet) açık gelir."
              : "You start with basic info (age, sex, main complaint)."}
          </li>
          <li>
            {lang === "tr"
              ? "Tanıyı ilk tahmininde bilirsen en yüksek puanı alırsın."
              : "Guessing the diagnosis on the first try gives you the highest score."}
          </li>
          <li>
            {lang === "tr"
              ? "Yanlış tahmin ve ek bilgi açma her seferinde puanını azaltır."
              : "Wrong guesses and requesting more info both reduce your score."}
          </li>
          <li>
            {lang === "tr"
              ? "Toplam 5 deneme hakkın var."
              : "You have 5 tries per case."}
          </li>
          <li>
            {lang === "tr"
              ? "Doğru tanıyı bulunca açıklama ve kaynakları görebilirsin."
              : "Find the correct diagnosis to see explanations and references."}
          </li>
        </ul>
        <Typography sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          {lang === "tr" ? "Puanlama" : "Scoring"}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">
            {lang === "tr"
              ? "Başlangıç puanı: 100"
              : "Starting score: 100"}
          </Typography>
          <Typography variant="body2">
            {lang === "tr"
              ? "Her yanlış tahminde: -10 puan"
              : "-10 points for each wrong guess"}
          </Typography>
          <Typography variant="body2">
            {lang === "tr"
              ? "Her yeni bilgi açmada: -20 puan"
              : "-20 points for each new info revealed"}
          </Typography>
        </Box>
        <Typography sx={{ mb: 2, fontWeight: 600 }}>
          {lang === "tr" ? "Hedefin" : "Your Goal"}
        </Typography>
        <Typography variant="body2">
          {lang === "tr"
            ? "En az bilgiyle, en kısa sürede ve en az denemeyle vakayı doğru tahmin et! Skorun, istatistiklerin ve liderlik tablosunda yüksel."
            : "Guess the case with minimum info, fewest tries and in shortest time for the highest score!"}
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="caption" color="text.secondary">
            {lang === "tr"
              ? "İyi eğlenceler! Geri bildirim ve öneriler için menüyü kullanabilirsin."
              : "Have fun! For feedback and suggestions, use the menu."}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
