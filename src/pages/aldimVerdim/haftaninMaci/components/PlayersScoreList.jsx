import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  Rating,
} from "@mui/material";

const PlayersScoreList = ({
  players,
  playerScores,
  handleUpdatePlayerScore,
  disabled,
}) => {
  // Oyuncuların initial skorlarını burada sakla
  const [initialScores, setInitialScores] = useState({});

  useEffect(() => {
    const initialMap = {};
    players.forEach((player) => {
      const score = playerScores.find((p) => p.id === player.id)?.score || 0;
      initialMap[player.id] = score;
    });
    setInitialScores(initialMap);
  }, [players, playerScores]);

  const sortedPlayers = [...players].sort((a, b) => {
    const scoreA = playerScores.find((p) => p.id === a.id)?.score || 0;
    const scoreB = playerScores.find((p) => p.id === b.id)?.score || 0;
    return scoreB - scoreA;
  });

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
          const currentScore =
            playerScores.find((p) => p.id === player.id)?.score || 0;

          return (
            <Paper
              key={player.id}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 1,
                borderRadius: 2,
                bgcolor: "#f9f9f9",
              }}
            >
              <Avatar sx={{ bgcolor: "#000", color: "#fff", mr: 2 }}>
                {player.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </Avatar>
              <Typography sx={{ flex: 1 }}>{player.name}</Typography>
              <Rating
                value={currentScore}
                precision={1}
                max={10}
                onChange={(event, newValue) => {
                  if (newValue == null) return;
                  const initial = initialScores[player.id] ?? 0;
                  const newAverage = Math.round(
                    (initial + newValue) / 2
                  );
                  handleUpdatePlayerScore(player.id, newAverage);
                }}
                disabled={disabled}
              />
              <Typography sx={{ ml: 2, fontWeight: "bold" }}>
                {currentScore}
              </Typography>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
};

export default PlayersScoreList;
