import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button, Box } from "@mui/material";
import AutorenewIcon from '@mui/icons-material/Autorenew';

function randomNickname() {
  // Basit rastgele isim havuzu
  const list = [
    "CardioKing", "NeuroStar", "DrReflex", "VakaMaster", "TanıUzmanı", "MedDoc", "DiagPro", "RapidRx", "EKGHero"
  ];
  return list[Math.floor(Math.random() * list.length)] + Math.floor(Math.random() * 100);
}

export default function ProfileDialog({ open, onClose, onNicknameSet, lang }) {
  const [nickname, setNickname] = useState("");
  const [generated, setGenerated] = useState("");

  useEffect(() => {
    if (open) {
      const stored = localStorage.getItem("nickname") || "";
      setNickname(stored);
      setGenerated("");
    }
  }, [open]);

  const handleRandom = () => {
    const name = randomNickname();
    setGenerated(name);
    setNickname(name);
  };

  const handleSave = () => {
    localStorage.setItem("nickname", nickname);
    if (onNicknameSet) onNicknameSet(nickname);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {lang === "tr" ? "Profil Bilgileri" : "Profile Information"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1, mb: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label={lang === "tr" ? "Rumuzunuz" : "Your nickname"}
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            fullWidth
            inputProps={{ maxLength: 20 }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<AutorenewIcon />}
              onClick={handleRandom}
            >
              {lang === "tr" ? "Rastgele oluştur" : "Random"}
            </Button>
            {nickname && (
              <span style={{ color: "#1976d2", fontWeight: 700, fontSize: "1.08em" }}>
                {lang === "tr" ? "Mevcut Rumuz: " : "Current: "} {nickname}
              </span>
            )}
          </Box>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!nickname.trim()}
            fullWidth
          >
            {lang === "tr" ? "Kaydet" : "Save"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
