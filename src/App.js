import React, { useState, useMemo, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import vakalar from "./data/vakalar.json";
import tanilar from "./data/tanilar.json";
import HeaderBar from "./components/HeaderBar";
import DemographicsCard from "./components/DemographicsCard";
import InfoStepCard from "./components/InfoStepCard";
import CaseArchiveDialog from "./components/CaseArchiveDialog";
import StatsDialog from "./components/StatsDialog";
import ProfileDialog from "./components/ProfileDialog";
import DailyLeaderboardDialog from "./components/DailyLeaderboardDialog";
import HelpDialog from "./components/HelpDialog";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { Autocomplete, TextField } from "@mui/material";


//stepler
import StepHistory from "./components/steps/StepHistory";
import StepBackground from "./components/steps/StepBackground";
import StepPhysicalExam from "./components/steps/StepPhysicalExam";
import StepFastTest from "./components/steps/StepFastTest";
import StepLab from "./components/steps/StepLab";
import StepImaging from "./components/steps/StepImaging";
import StepCourse from "./components/steps/StepCourse";
// Diğer stepler eklenebilir
const stepComponents = {
  history: StepHistory,
  background: StepBackground,
  physical_exam: StepPhysicalExam,
  fast_tests: StepFastTest,
  labs: StepLab,
  imaging: StepImaging,
  course: StepCourse
};

function renderStep(step, selectedVaka, lang) {
  const Comp = stepComponents[step.key];
  if (!Comp) return null;
  // Her componente uygun prop'ları geçiriyoruz:
  switch (step.key) {
    case "history":
      return <Comp data={selectedVaka.history?.[lang]} />;
    case "background":
      return <Comp data={selectedVaka.background?.[lang]} />;
    case "physical_exam":
      return <Comp data={selectedVaka.physical_exam?.[lang]} />;
    case "fast_tests":
      return <Comp data={selectedVaka.fast_tests} lang={lang} />;
    case "labs":
      return <Comp data={selectedVaka.labs} lang={lang} />;
    case "imaging":
      return <Comp data={selectedVaka.imaging?.[lang]} />;
    case "course":
      return <Comp data={selectedVaka.course?.[lang]} />;
    default:
      return null;
  }
}

// Tema
const themeLight = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#ffd600" }
  }
});
const themeDark = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1976d2" },
    secondary: { main: "#ffd600" }
  }
});

// Tarih stringi
function getTodayStr() {
  const today = new Date();
  const tzOff = today.getTimezoneOffset() * 60000;
  const localISO = new Date(today - tzOff).toISOString().slice(0, 10);
  return localISO;
}

// Günün vakasını veya en yakını döndür
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

// LocalStorage yardımcıları
function getSolvedCases() {
  return JSON.parse(localStorage.getItem("solvedCases") || "{}");
}
function setSolvedCase(date, result) {
  const solved = getSolvedCases();
  solved[date] = result;
  localStorage.setItem("solvedCases", JSON.stringify(solved));
}

// YENİ: Step ilerlemesini ve kalan hakkı localStorage'dan okuma/yazma
function getCaseProgress(date) {
  const progress = JSON.parse(localStorage.getItem("caseProgress") || "{}");
  return progress[date] || null;
}
function setCaseProgress(date, { infoStep, remainingTries }) {
  const progress = JSON.parse(localStorage.getItem("caseProgress") || "{}");
  progress[date] = { infoStep, remainingTries };
  localStorage.setItem("caseProgress", JSON.stringify(progress));
}
function clearCaseProgress(date) {
  const progress = JSON.parse(localStorage.getItem("caseProgress") || "{}");
  delete progress[date];
  localStorage.setItem("caseProgress", JSON.stringify(progress));
}

function getStats() {
  const solvedCases = getSolvedCases();
  const solvedDates = Object.keys(solvedCases).sort();
  const total = solvedDates.length;
  const correct = solvedDates.filter(d => solvedCases[d].success).length;
  const incorrect = total - correct;
  const totalScore = solvedDates.reduce((sum, d) => sum + (solvedCases[d].success ? parseInt(solvedCases[d].message.match(/\d+/)?.[0] || 0) : 0), 0);
  const avgScore = correct > 0 ? Math.round(totalScore / correct) : 0;
  let lastDate = solvedDates.length ? solvedDates[solvedDates.length - 1] : null;
  let lastResult = lastDate ? solvedCases[lastDate] : null;
  // Streak hesabı
  let streak = 0;
  let streakDates = [];
  const todayStr = getTodayStr();
  for (let i = solvedDates.length - 1; i >= 0; i--) {
    const d = solvedDates[i];
    if (!solvedCases[d].success) continue;
    if (streak === 0) {
      streak = 1;
      streakDates.push(d);
    } else {
      const prev = streakDates[streakDates.length - 1];
      const diff = (new Date(prev) - new Date(d)) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
        streakDates.push(d);
      } else {
        break;
      }
    }
  }
  if (!solvedCases[todayStr]?.success && streakDates[0] !== todayStr) {
    streak = 0;
  }
  return { total, correct, incorrect, avgScore, streak, lastResult, lastDate };
}

const BASE_SCORE = 100;
const WRONG_PENALTY = 10;
const MAX_TRIES = 5;

export default function App() {
  const [lang, setLang] = useState("tr");
  const [darkMode, setDarkMode] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  // Vaka seçimi ve state
  const todayVaka = useMemo(getTodayOrClosestCase, []);
  const [selectedVaka, setSelectedVaka] = useState(todayVaka);

  // YENİ: infoStep ve remainingTries progress'i localStorage'dan okuyarak başlatılır
  const initialProgress = getCaseProgress(todayVaka.date) || {};
  const [infoStep, setInfoStep] = useState(initialProgress.infoStep ?? 0);
  const [remainingTries, setRemainingTries] = useState(initialProgress.remainingTries ?? MAX_TRIES);

  const [selectedTanı, setSelectedTanı] = useState("");
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(BASE_SCORE);

  const steps = selectedVaka.steps || [];



  const totalStepCount = steps.length;

  // Eğer vaka değişirse veya sayfa ilk yüklenirse, localStorage'dan infoStep ve remainingTries oku!
  useEffect(() => {
    const solved = getSolvedCases();
    if (solved[selectedVaka.date]) {
      setResult(solved[selectedVaka.date]);
      setInfoStep(totalStepCount);
      setRemainingTries(0);
      // Skor hesaplama
      const totalPenalty = steps.reduce((acc, step) => acc + (step.penalty || 0), 0);
      setScore(BASE_SCORE - totalPenalty);
      clearCaseProgress(selectedVaka.date);
    } else {
      const progress = getCaseProgress(selectedVaka.date);
      setResult(null);
      setInfoStep(progress?.infoStep ?? 0);
      setRemainingTries(progress?.remainingTries ?? MAX_TRIES);
      setScore(BASE_SCORE); // Burada puan hesaplaması useEffect ile aşağıda güncelleniyor
    }
    setSelectedTanı("");
    // eslint-disable-next-line
  }, [selectedVaka]);

  // infoStep veya remainingTries değiştikçe, progress'i kaydet ve skor hesapla
  useEffect(() => {
    const openedPenalty = steps
      .slice(0, infoStep)
      .reduce((acc, step) => acc + (step.penalty || 0), 0);
    setScore(BASE_SCORE - openedPenalty - (MAX_TRIES - remainingTries) * WRONG_PENALTY);

    // Vaka çözülmemişse progress kaydet
    const solved = getSolvedCases();
    if (!solved[selectedVaka.date]) {
      setCaseProgress(selectedVaka.date, { infoStep, remainingTries });
    }
    // eslint-disable-next-line
  }, [infoStep, remainingTries, steps]);

  // Step açınca kaydı güncelle
  const handleShowMore = () => {
    if (infoStep < totalStepCount) {
      const newStep = infoStep + 1;
      setInfoStep(newStep);
      setCaseProgress(selectedVaka.date, { infoStep: newStep, remainingTries });
    }
  };

  // Tanı gönderimi
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
        justSolved: true,
        message:
          (lang === "tr"
            ? "Tebrikler! Doğru tanı."
            : "Congratulations! Correct diagnosis.") +
          ` ${lang === "tr" ? "Puanınız" : "Your score"}: ${score}`,
        tries: MAX_TRIES - remainingTries + 1
      };
      setResult(newResult);
      setSolvedCase(selectedVaka.date, { ...newResult, justSolved: false });
      setInfoStep(totalStepCount);
      setRemainingTries(0);
      setStatsOpen(true);
      clearCaseProgress(selectedVaka.date);

      // Günlük leaderboard kaydet
      const todayStr = selectedVaka.date;
      const nickname = localStorage.getItem("nickname") || "Anonim";
      const newEntry = { nickname, score, date: todayStr, time: Date.now() };
      let board = JSON.parse(localStorage.getItem(`leaderboard_daily_${todayStr}`) || "[]");
      const alreadyIdx = board.findIndex(e => e.nickname === nickname);
      if (alreadyIdx >= 0) {
        if (board[alreadyIdx].score < score) {
          board[alreadyIdx] = newEntry;
        }
      } else {
        board.push(newEntry);
      }
      board.sort((a, b) => b.score - a.score || a.time - b.time);
      localStorage.setItem(`leaderboard_daily_${todayStr}`, JSON.stringify(board));
    } else {
      const yeniTries = remainingTries - 1;
      setRemainingTries(yeniTries);
      setCaseProgress(selectedVaka.date, { infoStep, remainingTries: yeniTries });
      if (yeniTries === 0) {
        newResult = {
          success: false,
          outOfTries: true,
          message: lang === "tr"
            ? "Hakkınız bitti! Vaka çözülemedi. Doğru tanı: " + selectedVaka.correct_diagnosis[lang]
            : "No attempts left! You failed to solve the case. Correct diagnosis: " + selectedVaka.correct_diagnosis[lang],
          tries: 0
        };
        setResult(newResult);
        setSolvedCase(selectedVaka.date, newResult);
        setInfoStep(totalStepCount);
        setStatsOpen(true);
        clearCaseProgress(selectedVaka.date);
      } else {
        newResult = {
          success: false,
          message: (lang === "tr" ? "Yanlış tanı." : "Wrong diagnosis.") +
            ` ${lang === "tr" ? "Kalan hak" : "Remaining tries"}: ${yeniTries}/${MAX_TRIES}. ` +
            (lang === "tr" ? "Puanınız: " : "Your score: ") + (score - WRONG_PENALTY),
          tries: yeniTries
        };
        setResult(newResult);
      }
    }
  };

  function SolvedInfo() {
    if (!result) return null;
    const solved = getSolvedCases();
    if (solved[selectedVaka.date]) {
      return (
        <Box sx={{ my: 2 }}>
          <Typography color="info.main" sx={{ fontWeight: 600 }}>
            {lang === "tr"
              ? "Bu vakayı daha önce çözdünüz. Sonucunuzu tekrar görüyorsunuz."
              : "You have already solved this case. Your previous result is displayed."}
          </Typography>
        </Box>
      );
    }
    return null;
  }

  return (
    <ThemeProvider theme={darkMode ? themeDark : themeLight}>
      <Box sx={{
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(135deg, #181e24 0%, #23272b 100%)"
          : "linear-gradient(135deg, #e3f2fd 0%, #fffde7 100%)",
        py: 4
      }}>
        <HeaderBar
          lang={lang}
          setLang={setLang}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onOpenArchive={() => setArchiveOpen(true)}
          onOpenStats={() => setStatsOpen(true)}
          onOpenProfile={() => setProfileOpen(true)}
          onOpenLeaderboard={() => setLeaderboardOpen(true)}
          onOpenHelp={() => setHelpOpen(true)}
        />
        <Card sx={{ p: { xs: 0, md: 1 }, boxShadow: 12, borderRadius: 5, maxWidth: 630, margin: "0 auto" }}>
          <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
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

            {/* Sonuç info mesajı */}
            <SolvedInfo />

            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              {lang === "tr" ? "Vaka" : "Case"} ({selectedVaka.date})
            </Typography>

            <DemographicsCard selectedVaka={selectedVaka} lang={lang} vitals={selectedVaka.vitals?.[lang]} />

            {/* Steps ve Info Kartları */}
            {steps.slice(0, infoStep).map((step, idx) =>
  <InfoStepCard
    key={idx}
    item={{
      label: step.label,
      value: renderStep(step, selectedVaka, lang)
    }}
    idx={idx}
    lang={lang}
  />
)}

            {/* Bilgi açma butonu */}
            {infoStep < steps.length && !(result?.success || result?.outOfTries) && (
              <Button
                variant="contained"
                color="secondary"
                sx={{ my: 2, px: 4, py: 1, fontWeight: 600, fontSize: "1rem" }}
                onClick={handleShowMore}
              >
                {lang === "tr" ? "Daha fazla bilgi göster" : "Show more info"}
                &nbsp;(-{steps[infoStep]?.penalty || 0} {lang === "tr" ? "puan" : "points"})
              </Button>
            )}

            {/* Kalan hak ve puan */}
            {!(result?.success || result?.outOfTries) && (
              <>
                <Typography sx={{ my: 1, fontWeight: 500 }}>
                  {lang === "tr"
                    ? `Kalan hak: ${remainingTries}/${MAX_TRIES}`
                    : `Remaining tries: ${remainingTries}/${MAX_TRIES}`}
                </Typography>
                <motion.div
                  animate={result?.success ? { scale: [1, 1.12, 1] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <Typography variant="h6" sx={{ my: 2 }}>
                    {lang === "tr" ? "Puan" : "Score"}: {score}
                  </Typography>
                </motion.div>
              </>
            )}

            {/* Konfeti */}
            {result?.success && result.justSolved && <Confetti numberOfPieces={120} recycle={false} />}

            {/* Tanı seçimi */}
            <Box sx={{ my: 2 }}>
              <Autocomplete
                options={tanilar.map(t => t[lang])}
                value={selectedTanı}
                onChange={(e, newValue) => setSelectedTanı(newValue)}
                renderInput={(params) => <TextField {...params} label={lang === "tr" ? "Tanı seç" : "Select diagnosis"} variant="outlined" />}
                disabled={!!getSolvedCases()[selectedVaka.date]}
                sx={{ mb: 2 }}
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
            </Box>

            {/* Sonuç ve açıklama */}
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

        {/* MODALLAR */}
        <CaseArchiveDialog
          open={archiveOpen}
          onClose={() => setArchiveOpen(false)}
          vakalar={vakalar}
          getSolvedCases={getSolvedCases}
          setSelectedVaka={setSelectedVaka}
          lang={lang}
          todayVaka={todayVaka}
        />
        <StatsDialog
          open={statsOpen}
          onClose={() => setStatsOpen(false)}
          stats={getStats()}
          lang={lang}
        />
        <ProfileDialog
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          onNicknameSet={() => {}} // opsiyonel
          lang={lang}
        />
        <DailyLeaderboardDialog
          open={leaderboardOpen}
          onClose={() => setLeaderboardOpen(false)}
          date={todayVaka.date}
          lang={lang}
        />
        <HelpDialog
          open={helpOpen}
          onClose={() => setHelpOpen(false)}
          lang={lang}
        />
      </Box>
    </ThemeProvider>
  );
}
