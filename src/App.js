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
  const [infoStep, setInfoStep] = useState(0);
  const [selectedTanı, setSelectedTanı] = useState("");
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(BASE_SCORE);
  const [remainingTries, setRemainingTries] = useState(MAX_TRIES);

  // Adımlar (steps) ve info list
  const steps = selectedVaka.steps || [];
  // Step'e karşılık gelen datayı ve gösterimi döndür
  function getStepValue(step) {
    const key = step.key;
    // Her key için nasıl gösterileceğini burada tanımla
    switch (key) {
      case "history":
        return selectedVaka.history?.[lang];
      case "background":
        return (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {selectedVaka.background && selectedVaka.background[lang] &&
              Object.entries(selectedVaka.background[lang]).map(([title, value], idx) => (
                <li key={idx}><b>{title}:</b> {value}</li>
              ))}
          </ul>
        );
      case "physical_exam":
        return (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {selectedVaka.physical_exam && selectedVaka.physical_exam[lang] &&
              Object.entries(selectedVaka.physical_exam[lang]).map(([title, value], idx) => (
                <li key={idx}><b>{title}:</b> {value}</li>
              ))}
          </ul>
        );
      case "fast_tests":
        return (
          <Box>
            {/* Kan Gazı */}
            {selectedVaka.fast_tests?.blood_gas && (
              <>
                <Box sx={{ fontWeight: 600, color: theme => theme.palette.text.primary, mt: 1 }}>
                  {lang === "tr" ? "Kan Gazı:" : "Blood Gas:"}
                </Box>
                <ul style={{ margin: "4px 0 8px 18px" }}>
                  {Object.entries(selectedVaka.fast_tests.blood_gas).map(([k, v], i) => (
                    <li key={i}>{k}: {v.value} <span style={{ color: "#888", fontSize: "0.96em" }}>({v.ref})</span></li>
                  ))}
                </ul>
              </>
            )}
            {/* EKG */}
            {selectedVaka.fast_tests?.ekg && selectedVaka.fast_tests.ekg[lang] && (
              <>
                <Box sx={{ fontWeight: 600, color: theme => theme.palette.text.primary }}>
                  EKG
                </Box>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  {selectedVaka.fast_tests.ekg[lang]}
                </Typography>
              </>
            )}
            {/* Periferik Yayma */}
            {selectedVaka.fast_tests?.peripheral_smear && selectedVaka.fast_tests.peripheral_smear[lang] && (
              <>
                <Box sx={{ fontWeight: 600, color: theme => theme.palette.text.primary }}>
                  {lang === "tr" ? "Periferik Yayma:" : "Peripheral Smear:"}
                </Box>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  {selectedVaka.fast_tests.peripheral_smear[lang]}
                </Typography>
              </>
            )}
          </Box>
        );
      case "labs":
        return (
          <Box>
            {/* Hemogram */}
            {selectedVaka.labs?.hemogram && (
              <>
                <Box sx={{ fontWeight: 600, color: theme => theme.palette.text.primary, mt: 1 }}>
                  {lang === "tr" ? "Hemogram:" : "Hemogram:"}
                </Box>
                <ul style={{ margin: "4px 0 8px 18px" }}>
                  {Object.entries(selectedVaka.labs.hemogram).map(([k, v], i) => (
                    <li key={i}>{k}: {v.value} <span style={{ color: "#888", fontSize: "0.96em" }}>({v.ref})</span></li>
                  ))}
                </ul>
              </>
            )}
            {/* Biyokimya */}
            {selectedVaka.labs?.biochemistry && selectedVaka.labs.biochemistry[lang] && (
              <>
                <Box sx={{ fontWeight: 600, color: theme => theme.palette.text.primary }}>
                  {lang === "tr" ? "Biyokimya:" : "Biochemistry:"}
                </Box>
                <ul style={{ margin: "4px 0 8px 18px" }}>
                  {Object.entries(selectedVaka.labs.biochemistry[lang]).map(([k, v], i) => (
                    <li key={i}>{k}: {v.value} <span style={{ color: "#888", fontSize: "0.96em" }}>({v.ref})</span></li>
                  ))}
                </ul>
              </>
            )}
            {/* İdrar */}
            {selectedVaka.labs?.urinalysis && selectedVaka.labs.urinalysis[lang] && (
              <>
                <Box sx={{ fontWeight: 600, color: theme => theme.palette.text.primary }}>
                  {lang === "tr" ? "İdrar:" : "Urinalysis:"}
                </Box>
                <ul style={{ margin: "4px 0 8px 18px" }}>
                  {Object.entries(selectedVaka.labs.urinalysis[lang]).map(([k, v], i) => (
                    <li key={i}>{k}: {v.value} <span style={{ color: "#888", fontSize: "0.96em" }}>({v.ref})</span></li>
                  ))}
                </ul>
              </>
            )}
          </Box>
        );
      case "coombs_tests":
        return (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {selectedVaka.coombs_tests && selectedVaka.coombs_tests[lang] &&
              Object.entries(selectedVaka.coombs_tests[lang]).map(([title, value], idx) => (
                <li key={idx}><b>{title}:</b> {value}</li>
              ))}
          </ul>
        );
      case "imaging":
        return selectedVaka.imaging?.[lang];
      case "course":
        return selectedVaka.course?.[lang];
      default:
        return null;
    }
  }

  // Toplam adım sayısı
  const totalStepCount = steps.length;

  // App içi efektler
  useEffect(() => {
    const solved = getSolvedCases();
    if (solved[selectedVaka.date]) {
      setResult(solved[selectedVaka.date]);
      setInfoStep(totalStepCount);
      // Tüm step'lerin toplam penalty'sini al
      const totalPenalty = steps.reduce((acc, step) => acc + (step.penalty || 0), 0);
      setScore(BASE_SCORE - totalPenalty);
      setRemainingTries(0);
    } else {
      setResult(null);
      setInfoStep(0);
      setScore(BASE_SCORE);
      setRemainingTries(MAX_TRIES);
    }
    setSelectedTanı("");
    // eslint-disable-next-line
  }, [selectedVaka]);

  // Her bilgi adımı veya yanlış deneme sonrası skoru güncelle
  useEffect(() => {
    // O ana kadar açılan tüm step'lerin cezasını topla
    const openedPenalty = steps
      .slice(0, infoStep)
      .reduce((acc, step) => acc + (step.penalty || 0), 0);
    setScore(BASE_SCORE - openedPenalty - (MAX_TRIES - remainingTries) * WRONG_PENALTY);
    // eslint-disable-next-line
  }, [infoStep, remainingTries, steps]);

  // Adım gösterimi
  const handleShowMore = () => {
    if (infoStep < totalStepCount) {
      setInfoStep(infoStep + 1);
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

  // Bilgi blokları ikonlu ve gölgeli
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
                  value: getStepValue(step)
                }}
                idx={idx}
                lang={lang}
              />
            )}

            {/* Bilgi açma butonu */}
            {infoStep < totalStepCount && !(result?.success || result?.outOfTries) && (
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
