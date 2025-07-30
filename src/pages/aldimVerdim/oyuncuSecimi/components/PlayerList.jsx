import React from "react";
import {
  Grid,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { motion } from "framer-motion";
import getInitials from "../../../utils/getInitials";
import { useCaptainContext } from "../../../../context/CaptainContext";
import { useFoundWeek } from "../../../hooks/useFoundWeek";
import { useParams } from "react-router-dom";
import CoinFlipModal from "./CoinFlipModal";

export default function PlayerList() {
  const user = JSON.parse(localStorage.getItem("user"));
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { weekId } = useParams();
  const { foundWeek } = useFoundWeek(weekId);

  const {
    players,
    setPlayers,
    blackCaptain,
    setBlackCaptain,
    whiteCaptain,
    setWhiteCaptain,
    weeks,
    setWeeks,
    updateUserInWeekAndLocalStorage,
  } = useCaptainContext();

  const selectedCaptains = [blackCaptain, whiteCaptain].filter(Boolean);
  const isDisabled = user?.isAdmin === false || selectedCaptains.length > 1;

  const handleDeletePlayer = (playerId) => {
    if (!user?.isAdmin) return;

    const updated = players.filter((p) => p.id !== playerId);
    setPlayers(updated);

    if (blackCaptain?.id === playerId) setBlackCaptain(null);
    if (whiteCaptain?.id === playerId) setWhiteCaptain(null);
  };

  const handleAssignCaptain = (player) => {
    const username = player.name;
    const userData = foundWeek?.users?.[username];
    if (!userData) return;

    const captains = Object.entries(foundWeek?.users || {}).filter(
      ([, u]) => u.role === "kaptan" || u.isCaptain
    );

    const isAlreadyCaptain = userData.role === "kaptan" || userData.isCaptain;

    let updatedUserData = { ...userData };

    if (isAlreadyCaptain) {
      updatedUserData = {
        ...updatedUserData,
        role: "user",
        isCaptain: false,
        rank: null,
      };
    } else {
      if (captains.length === 1) {
        const existingCaptainRank = captains[0][1]?.rank;
        updatedUserData.rank =
          existingCaptainRank === "beyaz" ? "siyah" : "beyaz";
      } else {
        updatedUserData.rank = "siyah";
      }

      updatedUserData.isCaptain = true;
      updatedUserData.role = "kaptan";
    }

    const updatedWeek = {
      ...foundWeek,
      users: {
        ...foundWeek.users,
        [username]: updatedUserData,
      },
    };

    const newWeeks = weeks.map((w) =>
      w?.weekId === Number(weekId) ? updatedWeek : w
    );

    setWeeks(newWeeks);
    updateUserInWeekAndLocalStorage(username, updatedUserData);

    if (isAlreadyCaptain) {
      if (blackCaptain?.id === player.id) setBlackCaptain(null);
      if (whiteCaptain?.id === player.id) setWhiteCaptain(null);
    } else {
      if (!blackCaptain) setBlackCaptain(player);
      else if (!whiteCaptain) setWhiteCaptain(player);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#e8f5e9",
        p: 3,
        m: 2,
        pb: 12,
        borderRadius: 3,
        position: "relative",
        minHeight: 300,
      }}
    >
      <Typography variant="h6" fontWeight={700} mb={3} color="green">
        Oyuncu Listesi
      </Typography>

      <Grid container spacing={3}>
        {players.map((player) => {
          const isBlackCaptain = blackCaptain?.id === player.id;
          const isWhiteCaptain = whiteCaptain?.id === player.id;
          const isCaptain = isBlackCaptain || isWhiteCaptain;

          return (
            <Grid item xs={12} sm={12} md={4} key={player.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
              >
                <Paper
                  onClick={() => handleAssignCaptain(player)}
                  elevation={3}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "#fff",
                    display: "flex",
                    minWidth: !isMobile ? 350 : 250,
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: user?.isAdmin ? "pointer" : "default",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                      transition: "all 0.25s ease",
                    },
                  }}
                >
                  {/* Sol: Silme ikonu */}
                  {user?.isAdmin && (
                    <Tooltip title="Sil">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePlayer(player.id);
                        }}
                        sx={{
                          color: "#888",
                          "&:hover": { color: "#d32f2f" },
                          mr: 1,
                        }}
                        disabled={isDisabled}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}

                  {/* Ortada: Avatar + İsim */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      flexGrow: 1,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: isCaptain ? "#2e7d32" : "#1b5e20",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                      }}
                    >
                      {getInitials(player.name)}
                    </Avatar>

                    <Typography fontWeight={600} noWrap maxWidth={120}>
                      {player.name?.toUpperCase() || "?"}
                    </Typography>
                  </Box>

                  {/* Sağda: Kaptan etiketi */}
                  {isCaptain && (
                    <Chip
                      label={isBlackCaptain ? "Siyah" : "Beyaz"}
                      icon={<SportsSoccerIcon />}
                      size="small"
                      sx={{
                        bgcolor: isBlackCaptain ? "#212121" : "#1976d2",
                        color: "#fff",
                        fontWeight: 500,
                      }}
                    />
                  )}
                </Paper>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>

      {/* Sol altta oyuncu sayısı */}
      <Box
        sx={{
          position: "absolute",
          left: 16,
          bottom: 16,
          bgcolor: "rgba(0, 128, 0, 0.85)",
          color: "#fff",
          px: 2.5,
          py: 1.2,
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          fontWeight: 600,
          fontSize: 14,
          zIndex: 999,
          whiteSpace: "nowrap",
        }}
      >
        Toplam Oyuncu: {players.length}
      </Box>

      {/* Sağ altta yazı tura */}
      <Box
        sx={{
          position: "absolute",
          right: 30,
          bottom: 16,
          zIndex: 999,
        }}
      >
        <CoinFlipModal />
      </Box>
    </Box>
  );
}
