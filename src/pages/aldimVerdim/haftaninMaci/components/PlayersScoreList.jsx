import { useCaptainContext } from "../../../../context/CaptainContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Box, Typography, Paper, Stack, Avatar, Rating } from "@mui/material";

const PlayersScoreList = ({
  players,
  playerScores,
  disabled,
  setPlayerScores,
}) => {
  const { blackTeam, whiteTeam, weeks, weekId, setWeeks } = useCaptainContext();

  const [pendingScores, setPendingScores] = useState({});
  const [sortedPlayers, setSortedPlayers] = useState([]);
  const [lastRatedPlayerId, setLastRatedPlayerId] = useState(null);

  // Skora göre sıralama (manuel)
  const sortPlayers = useCallback(() => {
    const sorted = [...players].sort((a, b) => {
      const scoreA =
        pendingScores[a.id] ??
        playerScores.find((p) => p.id === a.id)?.score ??
        0;
      const scoreB =
        pendingScores[b.id] ??
        playerScores.find((p) => p.id === b.id)?.score ??
        0;
      return scoreB - scoreA;
    });
    setSortedPlayers(sorted);
  }, [players, playerScores, pendingScores]);

  // İlk açıldığında sıralı listeyi kur
  useEffect(() => {
    sortPlayers();
  }, [sortPlayers]);

  const handleRate = (playerId, newValue) => {
    if (newValue == null) return;

    setPendingScores((prev) => ({ ...prev, [playerId]: newValue }));
    setLastRatedPlayerId(playerId); // Animasyon için işaretle
    handleUpdatePlayerScore(playerId, newValue);
  };

  const handleUpdatePlayerScore = (playerId, newScore) => {
    setPlayerScores((prevScores) => {
      const existing = prevScores.find((p) => p.id === playerId);
      let newScores;
      if (existing) {
        newScores = prevScores.map((p) =>
          p.id === playerId ? { ...p, score: newScore } : p
        );
      } else {
        newScores = [...prevScores, { id: playerId, score: newScore }];
      }

      // Tüm oyuncuları takım bilgisiyle al
      const allPlayersWithTeam = [
        ...blackTeam.map((player) => ({ ...player, team: "black" })),
        ...whiteTeam.map((player) => ({ ...player, team: "white" })),
      ];

      // Güncellenmiş oyuncu detaylarını oluştur
      const playersDetails = allPlayersWithTeam.map((player) => ({
        ...player,
        score: newScores.find((p) => p.id === player.id)?.score || 0,
      }));

      // Haftalar dizisini güncelle
      const updatedWeeks = weeks.map((week) => {
        if (week.weekId === Number(weekId)) {
          return {
            ...week,
            playersDetails,
          };
        }
        return week;
      });

      setWeeks(updatedWeeks);

      return newScores;
    });
  };

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}
      >
        Oyuncu Puanları
      </Typography>

      <Stack spacing={1}>
        {sortedPlayers.map((player) => {
          const score =
            pendingScores[player.id] ??
            playerScores.find((p) => p.id === player.id)?.score ??
            0;

          const isRecentlyRated = player.id === lastRatedPlayerId;

          return (
            <AnimatePresence key={player.id}>
              <motion.div
                initial={false}
                animate={
                  isRecentlyRated
                    ? { scale: [1, 1.05, 1], opacity: [1, 0.8, 1] }
                    : { scale: 1, opacity: 1 }
                }
                transition={{
                  duration: 0.5,
                }}
              >
                <Paper
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "#f9f9f9",
                  }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", minWidth: 0 }}
                  >
                    <Avatar sx={{ bgcolor: "#000", color: "#fff", mr: 2 }}>
                      {player.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </Avatar>
                    <Typography noWrap sx={{ fontWeight: 500 }}>
                      {player.name}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: { xs: 1, sm: 0 },
                      gap: 1,
                    }}
                  >
                    <Rating
                      value={score}
                      precision={1}
                      max={5}
                      onChange={(event, newValue) =>
                        handleRate(player.id, newValue)
                      }
                      disabled={disabled}
                    />
                  </Box>
                </Paper>
              </motion.div>
            </AnimatePresence>
          );
        })}
      </Stack>
    </Box>
  );
};

export default PlayersScoreList;
