import React, { useRef,useState, useMemo, useEffect } from "react";
import StarIcon from "@mui/icons-material/Star";
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
import DiagnosisSelect from "./components/DiagnosisSelect";
import DiagnosisSelectVirtual from "./components/DiagnosisSelectVirtual";
import diagnosisExplanations from "./data/diagnosisExplanation.json";
import ResultCard from "./components/ResultCard";
import AppFooter from "./components/AppFooter";
// stepler
import StepHistory from "./components/steps/StepHistory";
import StepBackground from "./components/steps/StepBackground";
import StepPhysicalExam from "./components/steps/StepPhysicalExam";
import StepFastTest from "./components/steps/StepFastTest";
import StepLab from "./components/steps/StepLab";
import StepImaging from "./components/steps/StepImaging";
import StepCourse from "./components/steps/StepCourse";

import { Accordion, AccordionSummary, AccordionDetails} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";

// Step componentleri eşleştiriliyor
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
    secondary: { main: "#ffd600" },
    background: { default: "#f6fbff" }
  },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif"
  }
});
const themeDark = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1976d2" },
    secondary: { main: "#ffd600" },
    background: {
      default: "#20272e", // ana arka plan
      paper: "#23272b"    // kart arka planı
    }
  },
  typography: { fontFamily: "Inter, Roboto, Arial, sans-serif" }
});

// Yardımcı fonksiyonlar
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
  const statsButtonRef = useRef();

  const todayVaka = useMemo(getTodayOrClosestCase, []);
  const [selectedVaka, setSelectedVaka] = useState(todayVaka);

  const initialProgress = getCaseProgress(todayVaka.date) || {};
  const [infoStep, setInfoStep] = useState(initialProgress.infoStep ?? 0);
  const [remainingTries, setRemainingTries] = useState(initialProgress.remainingTries ?? MAX_TRIES);

  const [selectedTanı, setSelectedTanı] = useState("");
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(BASE_SCORE);

  const steps = selectedVaka.steps || [];
  const totalStepCount = steps.length;
  const matchedDiagnosisDetail = diagnosisExplanations.find(tani =>
    tani[lang] === selectedVaka.correct_diagnosis[lang]
);
  

  useEffect(() => {
    const solved = getSolvedCases();
    if (solved[selectedVaka.date]) {
      setResult(solved[selectedVaka.date]);
      setInfoStep(totalStepCount);
      setRemainingTries(0);
      const totalPenalty = steps.reduce((acc, step) => acc + (step.penalty || 0), 0);
      setScore(BASE_SCORE - totalPenalty);
      clearCaseProgress(selectedVaka.date);
    } else {
      const progress = getCaseProgress(selectedVaka.date);
      setResult(null);
      setInfoStep(progress?.infoStep ?? 0);
      setRemainingTries(progress?.remainingTries ?? MAX_TRIES);
      setScore(BASE_SCORE);
    }
    setSelectedTanı("");
    // eslint-disable-next-line
  }, [selectedVaka]);

  useEffect(() => {
    const openedPenalty = steps
      .slice(0, infoStep)
      .reduce((acc, step) => acc + (step.penalty || 0), 0);
    setScore(BASE_SCORE - openedPenalty - (MAX_TRIES - remainingTries) * WRONG_PENALTY);

    const solved = getSolvedCases();
    if (!solved[selectedVaka.date]) {
      setCaseProgress(selectedVaka.date, { infoStep, remainingTries });
    }
    // eslint-disable-next-line
  }, [infoStep, remainingTries, steps]);

  const handleShowMore = () => {
    if (infoStep < totalStepCount) {
      const newStep = infoStep + 1;
      setInfoStep(newStep);
      setCaseProgress(selectedVaka.date, { infoStep: newStep, remainingTries });
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
          ? "linear-gradient(135deg, #23272b 0%, #293241 100%)"
          : "linear-gradient(135deg, #e3f2fd 0%, #fffde7 100%)",
        py: 4,
        mt: { xs: "64px", sm: "68px" } // Header'ın yüksekliği kadar boşluk bırak
      }}>
        <HeaderBar
          lang={lang}
          setLang={setLang}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onOpenArchive={() => setArchiveOpen(true)}
          onOpenStats={() => {
      setStatsOpen(true);
      setTimeout(() => {
        // Modal açıldıktan sonra focus stats dialog'a kayıyor zaten
      }, 100);
    }}
    statsButtonRef={statsButtonRef}  // Bunu aşağıda HeaderBar'da kullanmak için
          onOpenProfile={() => setProfileOpen(true)}
          onOpenLeaderboard={() => setLeaderboardOpen(true)}
          onOpenHelp={() => setHelpOpen(true)}
        />
        <Card sx={{
  p: { xs: 0, md: 2.5 },
  background: theme => theme.palette.mode === "dark" ? "#23272b" : "#fff",
  boxShadow: "0 6px 36px #bdbdbd26",
  borderRadius: 7,
  maxWidth: 680,
  margin: "0 auto"
}}>
         <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
  <Box sx={{ mb: 2, textAlign: "center" }}>
    {/* Günün vakası rozeti */}
    {selectedVaka.date === todayVaka.date && (
      <Box sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        mb: 1,
        px: 2.5,
        py: 0.8,
        borderRadius: 3,
        fontWeight: 800,
        fontSize: "1.08rem",
        color: "#fff",
        background: "linear-gradient(90deg, #1976d2 30%, #90caf9 100%)",
        boxShadow: "0 2px 12px #90caf955"
      }}>
        <StarIcon sx={{ fontSize: 21, mr: 0.7, color: "#ffd600" }} />
        {lang === "tr" ? "GÜNÜN VAKASI" : "CASE OF THE DAY"}
      </Box>
    )}

    {/* Tarih */}
    <Typography
      sx={{
        fontWeight: 600,
        color: "#90a4ae",
        fontSize: { xs: "1.07rem", sm: "1.11rem" },
        letterSpacing: 0.09,
        mt: 0.7,
        mb: 0.1
      }}
    >
      {selectedVaka.date.replace(/-/g, ".")}
    </Typography>
  </Box>

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
                sx={{
    width: "100%",
    my: 2, px: 3, py: 1.5,
    fontWeight: 700,
    fontSize: "1.0rem",
    borderRadius: 3.5,
    background: "linear-gradient(90deg, #fff9c4 60%, #ffe082 100%)",
    color: "#424242",
    boxShadow: "0 1px 8px #ffd60033",
    "&:hover": {
      background: "linear-gradient(90deg, #ffe066 60%, #ffd600 100%)",
      color: "#1976d2"
    }
  }}
                onClick={handleShowMore}
              >
                {lang === "tr" ? "DAHA FAZLA BİLGİ GÖSTER" : "SHOW MORE INFO"}
                &nbsp;(-{steps[infoStep]?.penalty || 0} {lang === "tr" ? "puan" : "points"})
              </Button>
            )}

            {/* Kalan hak ve puan */}
            {!(result?.success || result?.outOfTries) && (
              <Box sx={{
  display: "flex",
  alignItems: "center",
  gap: 1.2,
  background: "rgba(255, 214, 0, 0.09)",
  borderRadius: 2.5,
  px: 2, py: 1,
  my: 2,
  fontWeight: 500,
  fontSize: "1.07rem"
}}>
  <span>❤️</span>
  <Typography variant="body1" sx={{ fontSize: "1.08rem", fontWeight: 600 }}>
    {lang === "tr"
      ? `Kalan hak: ${remainingTries}/${MAX_TRIES}`
      : `Remaining tries: ${remainingTries}/${MAX_TRIES}`}
  </Typography>
  <span>⭐</span>
  <Typography variant="body1" sx={{ fontSize: "1.08rem", fontWeight: 600 }}>
    {lang === "tr" ? "Puan" : "Score"}: {score}
  </Typography>
</Box>
            )}

            {/* Konfeti */}
            {result?.success && result.justSolved && <Confetti numberOfPieces={120} recycle={false} />}

            {/* Tanı seçimi */}
            <Box sx={{ my: 2 }}>
  <DiagnosisSelectVirtual
    options={tanilar.map(t => t[lang])}
    value={selectedTanı}
    onChange={(e, newValue) => setSelectedTanı(newValue)}
    label={lang === "tr" ? "Tanı seç veya ara" : "Search or select diagnosis"}
    disabled={!!getSolvedCases()[selectedVaka.date]}
    lang={lang}
  />
  <Button
  variant="contained"
  color="primary"
  sx={{
    mt: 1,
    width: "100%",
    fontWeight: 800,
    px: 4,
    py: 1.3,
    fontSize: { xs: "1.09rem", sm: "1.16rem" },
    letterSpacing: 0.6,
    borderRadius: 3.5,
    boxShadow: "0 4px 14px #1976d244",
    background: theme => theme.palette.mode === "dark"
  ? "linear-gradient(90deg, #2196f3 0%, #1565c0 100%)"
  : "linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)",
    textTransform: "none",
    transition: "all 0.16s cubic-bezier(.4,0,.2,1)",
    "&:hover": {
      background: "linear-gradient(90deg, #1565c0 0%, #2196f3 100%)",
      boxShadow: "0 6px 18px #1976d299",
      transform: "scale(1.035)"
    },
    "&:active": {
      background: "linear-gradient(90deg, #0d47a1 0%, #1565c0 100%)",
      transform: "scale(0.97)"
    },
    "&.Mui-disabled": {
      background: "linear-gradient(90deg, #e0e0e0 0%, #bdbdbd 100%)",
      color: "#aaa",
      boxShadow: "none"
    }
  }}
  onClick={handleSubmit}
  disabled={!!getSolvedCases()[selectedVaka.date]}
>
  {lang === "tr" ? "Gönder" : "Submit"}
</Button>
</Box>

            {/* Sonuç ve açıklama */}
            <ResultCard
  result={result}
  selectedVaka={selectedVaka}
  diagnosisDetail={matchedDiagnosisDetail}
  lang={lang}
/>
<AppFooter />
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
    onClose={() => {
      setStatsOpen(false);
      // Modal kapanınca ana stats butonuna focus ver!
      statsButtonRef.current?.focus();
    }}
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
