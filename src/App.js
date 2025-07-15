import React, { useState, useMemo } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  Box
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import vakalar from "./data/vakalar.json";
import tanilar from "./data/tanilar.json";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

import DemographicsCard from "./components/DemographicsCard";
import InfoStepCard from "./components/InfoStepCard";
import CaseArchiveDialog from "./components/CaseArchiveDialog";

// MUI tema ayarı
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#ffd600" },
    background: { default: "#e3f2fd" }
  },
  shape: { borderRadius: 16 },
  typography: { fontFamily: "Montserrat, Roboto, Arial" }
});

// Tarih stringi oluşturur: YYYY-MM-DD
function getTodayStr() {
  const today = new Date();
  const tzOff = today.getTimezoneOffset() * 60000;
  const localISO = new Date(today - tzOff).toISOString().slice(0, 10);
  return localISO;
}

function getTodayOrClosestCase() {
  const todayStr = getTodayStr();
  const sortedVakalar = [...vakalar].sort((a, b) => a.date.localeCompare(b.date));
  let selected = sortedVakalar[0];
  for (let vaka of sortedVakalar) {
    if (vaka.date <= todayStr) selected = vaka;
    if (vaka.date === todayStr) break;
  }
  return selected;
}

function getSolvedCases() {
  return JSON.parse(localStorage.getItem("solvedCases") || "{}");
}
function setSolvedCase(date, result) {
  const solved = getSolvedCases();
  solved[date] = result;
  localStorage.setItem("solvedCases", JSON.stringify(solved));
}

function App() {
  const [lang, setLang] = useState("tr");
  const [archiveOpen, setArchiveOpen] = useState(false);
  const todayVaka = useMemo(getTodayOrClosestCase, []);
  const [selectedVaka, setSelectedVaka] = useState(todayVaka);

  // infoStep, skor, selectedTanı; sadece vaka değişince baştan başlar
  const [infoStep, setInfoStep] = useState(0);
  const [selectedTanı, setSelectedTanı] = useState("");
  const [result, setResult] = useState(null);

  const BASE_SCORE = 100;
  const INFO_PENALTY = 20;
  const WRONG_PENALTY = 10;

  const vitals = useMemo(() => selectedVaka.vitals && selectedVaka.vitals[lang], [selectedVaka, lang]);

  // Bilgi blokları
  const infoList = [
    {
      label: { tr: "Hikaye", en: "History" },
      value: selectedVaka.history[lang]
    },
    {
      label: { tr: "Özgeçmiş, Alışkanlık, İlaç, Aile", en: "Background, Habits, Medications, Family" },
      value: Array.isArray(selectedVaka.background[lang])
        ? (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {selectedVaka.background[lang].map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )
        : selectedVaka.background[lang]
    },
    {
      label: { tr: "Fizik Muayene", en: "Physical Exam" },
      value: selectedVaka.physical_exam[lang]
    },
    {
      label: { tr: "Laboratuvar", en: "Laboratory" },
      value: (
        <Box>
          {/* Biyokimya */}
          {selectedVaka.labs && Object.keys(selectedVaka.labs).length > 0 && (
            <>
              <Box sx={{ fontWeight: 600, color: "#263238", mt: 1 }}>
                {lang === "tr" ? "Biyokimya:" : "Biochemistry:"}
              </Box>
              <ul style={{ margin: "4px 0 8px 18px" }}>
                {Object.entries(selectedVaka.labs).map(([k, v], i) => (
                  <li key={i}>{k}: {v}</li>
                ))}
              </ul>
            </>
          )}
          {/* Kan Gazı */}
          {selectedVaka.blood_gas && Object.keys(selectedVaka.blood_gas).length > 0 && (
            <>
              <Box sx={{ fontWeight: 600, color: "#263238" }}>
                {lang === "tr" ? "Kan Gazı:" : "Blood Gas:"}
              </Box>
              <ul style={{ margin: "4px 0 8px 18px" }}>
                {Object.entries(selectedVaka.blood_gas).map(([k, v], i) => (
                  <li key={i}>{k}: {v}</li>
                ))}
              </ul>
            </>
          )}
          {/* Hemogram */}
          {selectedVaka.hemogram && Object.keys(selectedVaka.hemogram).length > 0 && (
            <>
              <Box sx={{ fontWeight: 600, color: "#263238" }}>
                Hemogram:
              </Box>
              <ul style={{ margin: "4px 0 8px 18px" }}>
                {Object.entries(selectedVaka.hemogram).map(([k, v], i) => (
                  <li key={i}>{k}: {String(v)}</li>
                ))}
              </ul>
            </>
          )}
          {/* İdrar */}
          {selectedVaka.urinalysis && Object.keys(selectedVaka.urinalysis).length > 0 && (
            <>
              <Box sx={{ fontWeight: 600, color: "#263238" }}>
                {lang === "tr" ? "İdrar:" : "Urinalysis:"}
              </Box>
              <ul style={{ margin: "4px 0 8px 18px" }}>
                {Object.entries(selectedVaka.urinalysis).map(([k, v], i) => (
                  <li key={i}>{k}: {v}</li>
                ))}
              </ul>
            </>
          )}
        </Box>
      )
    },
    {
      label: { tr: "EKG & Görüntüleme", en: "ECG & Imaging" },
      value: [selectedVaka.ekg ? selectedVaka.ekg[lang] : "", selectedVaka.imaging ? selectedVaka.imaging[lang] : ""].filter(Boolean).join(" | ")
    },
    ...(selectedVaka.course && selectedVaka.course[lang]
      ? [{
          label: { tr: "Klinik Seyir", en: "Clinical Course" },
          value: selectedVaka.course[lang]
        }]
      : [])
  ];

  // Skor mantığı
  const [score, setScore] = useState(BASE_SCORE);

  // Sadece VAKA değişince infoStep ve skor başa dönüyor. Dil değişiminde aynen kalıyor!
  React.useEffect(() => {
    const solved = getSolvedCases();
    if (solved[selectedVaka.date]) {
      setResult(solved[selectedVaka.date]);
      setInfoStep(infoList.length);
      setScore(BASE_SCORE - infoList.length * INFO_PENALTY);
    } else {
      setResult(null);
      setInfoStep(0);
      setScore(BASE_SCORE);
    }
    setSelectedTanı("");
    // eslint-disable-next-line
  }, [selectedVaka]);

  React.useEffect(() => {
    setScore(BASE_SCORE - infoStep * INFO_PENALTY);
    // eslint-disable-next-line
  }, [infoStep]);

  const handleShowMore = () => {
    if (infoStep < infoList.length) {
      setInfoStep(infoStep + 1);
      setScore(BASE_SCORE - (infoStep + 1) * INFO_PENALTY);
    }
  };

  const handleSubmit = () => {
    if (!selectedTanı) return;
    const solved = getSolvedCases();
    if (solved[selectedVaka.date]) {
      setResult(solved[selectedVaka.date]);
      return;
    }
    let newResult;
    if (selectedTanı === selectedVaka.correct_diagnosis[lang]) {
      newResult = {
        success: true,
        message:
          (lang === "tr"
            ? "Tebrikler! Doğru tanı."
            : "Congratulations! Correct diagnosis.") +
          ` ${lang === "tr" ? "Puanınız" : "Your score"}: ${score}`
      };
      setInfoStep(infoList.length);
    } else {
      setScore((prevScore) => Math.max(prevScore - WRONG_PENALTY, 0));
      newResult = {
        success: false,
        message:
          (lang === "tr" ? "Yanlış tanı." : "Wrong diagnosis.") +
          ` ${lang === "tr" ? "Puanınız" : "Your score"}: ${score - WRONG_PENALTY}`
      };
    }
    setResult(newResult);
    setSolvedCase(selectedVaka.date, newResult);
  };

  const handleVakaSelect = (vaka) => {
    setSelectedVaka(vaka);
    setArchiveOpen(false);
  };

  function SolvedInfo() {
    if (!result) return null;
    const solved = getSolvedCases();
    if (solved[selectedVaka.date]) {
      return (
        <Alert severity="info" sx={{ my: 2 }}>
          {lang === "tr"
            ? "Bu vakayı daha önce çözdünüz. Sonucunuzu tekrar görüyorsunuz."
            : "You have already solved this case. Your previous result is displayed."}
        </Alert>
      );
    }
    return null;
  }

  function ArchiveInfo() {
    const solved = getSolvedCases();
    if (solved[selectedVaka.date]) return null;
    if (selectedVaka.date === todayVaka.date) {
      return (
        <Alert severity="info" sx={{ my: 2 }}>
          {lang === "tr"
            ? "Bu vaka bugünün vakasıdır. Buradan çözdüğünüzde puanınız günlük sıralamaya eklenir."
            : "This is today's case. Your score will count for the daily leaderboard."}
        </Alert>
      );
    } else {
      return (
        <Alert severity="info" sx={{ my: 2 }}>
          {lang === "tr"
            ? "Bu vaka arşivden çözülüyor. Puanınız kişisel istatistiklere eklenir, günlük sıralamayı etkilemez."
            : "This is an archive case. Your score will count only towards personal statistics, not the daily leaderboard."}
        </Alert>
      );
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #fffde7 100%)",
        py: 4
      }}>
        <Card sx={{ p: { xs: 0, md: 1 }, boxShadow: 12, borderRadius: 5, maxWidth: 630, margin: "0 auto" }}>
          <CardContent>
            {/* Günün vakası rozeti */}
            {selectedVaka.date === todayVaka.date && (
              <Box sx={{
                mb: 2,
                px: 2, py: 0.7, borderRadius: 3, display: "inline-block",
                fontWeight: 800, fontSize: "1.1rem",
                color: "#fff", background: "linear-gradient(90deg,#1976d2,#ffd600)"
              }}>
                {lang === "tr" ? "GÜNÜN VAKASI" : "CASE OF THE DAY"}
              </Box>
            )}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Button onClick={() => setArchiveOpen(true)} size="small" variant="outlined">
                {lang === "tr" ? "Arşiv" : "Archive"}
              </Button>
              <Button onClick={() => setLang(lang === "tr" ? "en" : "tr")} size="small" variant="outlined">
                {lang === "tr" ? "English" : "Türkçe"}
              </Button>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              {lang === "tr" ? "Vaka" : "Case"} ({selectedVaka.date})
            </Typography>
            <DemographicsCard selectedVaka={selectedVaka} lang={lang} vitals={vitals} />
            {infoList.slice(0, infoStep).map((item, idx) =>
              <InfoStepCard item={item} idx={idx} key={idx} lang={lang} />
            )}
            {infoStep < infoList.length && !result?.success && (
              <Button
                variant="contained"
                color="secondary"
                sx={{ my: 2, px: 4, py: 1, fontWeight: 600, fontSize: "1rem" }}
                onClick={handleShowMore}
              >
                {lang === "tr" ? "Daha fazla bilgi göster" : "Show more info"}
                &nbsp;(-{INFO_PENALTY} {lang === "tr" ? "puan" : "points"})
              </Button>
            )}
            <motion.div
              animate={result?.success ? { scale: [1, 1.12, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              {!result && (
                <Typography variant="h6" sx={{ my: 2 }}>
                  {lang === "tr" ? "Puan" : "Score"}: {score}
                </Typography>
              )}
            </motion.div>
            {result?.success && <Confetti numberOfPieces={120} recycle={false} />}
            <ArchiveInfo />
            <SolvedInfo />

            <Autocomplete
              options={tanilar.map(t => t[lang])}
              value={selectedTanı}
              onChange={(e, newValue) => setSelectedTanı(newValue)}
              renderInput={(params) => <TextField {...params} label={lang === "tr" ? "Tanı seç" : "Select diagnosis"} variant="outlined" />}
              disabled={!!getSolvedCases()[selectedVaka.date]}
              sx={{ my: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1, fontWeight: 600, px: 4, py: 1, fontSize: "1rem" }}
              onClick={handleSubmit}
              disabled={!!getSolvedCases()[selectedVaka.date]}
            >
              {lang === "tr" ? "Gönder" : "Submit"}
            </Button>
            {result && (
              <Box sx={{ mt: 2 }}>
                <Typography color={result.success ? "green" : "red"}>{result.message}</Typography>
                {result.success && (
                  <>
                    <Typography sx={{ mt: 1 }}>
                      <b>{lang === "tr" ? "Açıklama" : "Explanation"}:</b> {selectedVaka.explanation[lang]}
                    </Typography>
                    <Typography>
                      <b>{lang === "tr" ? "Kaynak" : "Reference"}:</b>{" "}
                      {selectedVaka.references.map(r => r[lang]).join(", ")}
                    </Typography>
                  </>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
        {/* Arşiv Modalı */}
        <CaseArchiveDialog
          open={archiveOpen}
          onClose={() => setArchiveOpen(false)}
          vakalar={vakalar}
          lang={lang}
          todayVaka={todayVaka}
          getSolvedCases={getSolvedCases}
          handleVakaSelect={handleVakaSelect}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
