import React from "react";
import {
  AppBar, Toolbar, IconButton, Typography, Drawer, Box, Divider, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import SettingsIcon from '@mui/icons-material/Settings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LanguageIcon from '@mui/icons-material/Language';
import ListItemIcon from '@mui/material/ListItemIcon';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';


export default function HeaderBar({
  lang, setLang,
  darkMode, setDarkMode,
  onOpenArchive, onOpenStats,onOpenLeaderboard,
  onOpenProfile, onOpenHelp
}) {
  // Sol Drawer için state
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  // Sağ ayar menüsü için state
  const [anchorEl, setAnchorEl] = React.useState(null);

  const openSettings = (event) => setAnchorEl(event.currentTarget);
  const closeSettings = () => setAnchorEl(null);

  return (
    <>
      <AppBar position="static" elevation={1} color="inherit" sx={{ mb: 3 }}>
        <Toolbar sx={{ minHeight: 64 }}>
          {/* Sol: Menü ikonu */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            aria-label="menu"
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Orta: Uygulama Adı */}
          <Typography
            variant="h5"
            sx={{
              flex: 1,
              fontWeight: 800,
              textAlign: "center",
              letterSpacing: 1,
              userSelect: "none"
            }}
          >
            Case of The Day
          </Typography>

          <IconButton color="inherit" onClick={onOpenLeaderboard}>
          <LeaderboardIcon />
          </IconButton>
          <IconButton color="inherit" onClick={onOpenHelp}>
          <HelpOutlineIcon />
          </IconButton>
          <IconButton color="inherit" onClick={openSettings}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sol Drawer (Menü) */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, pt: 1 }}>
          <Typography variant="h6" sx={{ px: 2, mb: 1, mt: 1, fontWeight: 700 }}>
            Menü
          </Typography>
          <Divider />
          <List>
  <ListItem disablePadding>
    <ListItemButton onClick={() => { setDrawerOpen(false); onOpenArchive(); }}>
      <ListItemText primary={lang === "tr" ? "Çözdüklerim" : "My Cases"} />
    </ListItemButton>
  </ListItem>
  <ListItem disablePadding>
    <ListItemButton onClick={() => { setDrawerOpen(false); onOpenStats(); }}>
      <ListItemText primary={lang === "tr" ? "İstatistiklerim" : "My Stats"} />
    </ListItemButton>
  </ListItem>
  <ListItem disablePadding>
    <ListItemButton onClick={() => { setDrawerOpen(false); if (typeof onOpenProfile === "function") onOpenProfile(); }}>
      <ListItemText primary={lang === "tr" ? "Profilim" : "My Profile"} />
    </ListItemButton>
  </ListItem>
</List>
        </Box>
      </Drawer>

      {/* Sağ Ayar Menüsü */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeSettings}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => { setDarkMode(d => !d); closeSettings(); }}>
          <ListItemIcon>
            {darkMode ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
          </ListItemIcon>
          {darkMode ? (lang === "tr" ? "Açık Mod" : "Light Mode") : (lang === "tr" ? "Koyu Mod" : "Dark Mode")}
        </MenuItem>
        <MenuItem onClick={() => { setLang(l => l === "tr" ? "en" : "tr"); closeSettings(); }}>
          <ListItemIcon>
            <LanguageIcon fontSize="small" />
          </ListItemIcon>
          {lang === "tr" ? "English" : "Türkçe"}
        </MenuItem>
      </Menu>
    </>
  );
}
