import React, { useState, useEffect } from "react";
import { Box, Button, Stack } from "@mui/material";
import { useCaptainContext } from "../../../context/CaptainContext";
import TeamDisplay from "./components/TeamDisplay";
import ScoreInputs from "./components/ScoreInputs";
import PlayersScoreList from "./components/PlayersScoreList";

const WeekMatch = () => {
  const { blackTeam, whiteTeam, weeks, weekId, setWeeks, isAdmin } =
    useCaptainContext();

  const [showTeams, setShowTeams] = useState(false);
  const [blackScore, setBlackScore] = useState("");
  const [whiteScore, setWhiteScore] = useState("");
  const [playerScores, setPlayerScores] = useState([]);

  const currentWeek = weeks.find((w) => w?.weekId === Number(weekId));
  const isFinished = currentWeek?.isFinished;

  useEffect(() => {
    if (!currentWeek) return;

    if (currentWeek.blackScore != null) {
      setBlackScore(currentWeek.blackScore);
    }
    if (currentWeek.whiteScore != null) {
      setWhiteScore(currentWeek.whiteScore);
    }
    if (currentWeek.playersDetails?.length > 0) {
      const scores = currentWeek.playersDetails.map((p) => ({
        id: p.id,
        score: p.score,
      }));
      setPlayerScores(scores);
    }
  }, [currentWeek]);

  const handleFinishWeek = () => {
    if (blackScore === "" || whiteScore === "") {
      alert("Lütfen önce skorları giriniz.");
      return;
    }

    const finishedAt = new Date().toISOString();

    const allPlayersWithTeam = [
      ...blackTeam.map((player) => ({ ...player, team: "black" })),
      ...whiteTeam.map((player) => ({ ...player, team: "white" })),
    ];

    const playersDetails = allPlayersWithTeam.map((player) => ({
      ...player,
      score: playerScores.find((p) => p.id === player.id)?.score || 0,
    }));

    const updatedWeeks = weeks.map((week) => {
      if (week.weekId === Number(weekId)) {
        return {
          ...week,
          blackScore: Number(blackScore),
          whiteScore: Number(whiteScore),
          isFinished: true,
          finishedAt,
          playersDetails,
        };
      }
      return week;
    });

   

    setWeeks(updatedWeeks);
    alert("Hafta başarıyla bitirildi!");
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

      console.log("Updating weeks with new player scores:", updatedWeeks);

      setWeeks(updatedWeeks);

      return newScores;
    });
  };

  const allPlayers = [
    ...blackTeam.map((player) => ({ ...player, team: "black" })),
    ...whiteTeam.map((player) => ({ ...player, team: "white" })),
  ];
  return (
    <Box sx={{ p: 2 }}>
      <Button
        onClick={() => setShowTeams(!showTeams)}
        sx={{
          background: "linear-gradient(135deg, #FF416C, #FF4B2B)",
          color: "#fff",
          borderRadius: "50px",
          padding: "15px 30px",
          fontSize: "18px",
          width: "100%",
          fontWeight: "bold",
          letterSpacing: "1px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      >
        Haftanın Maçı Kadroları
      </Button>

      {(showTeams || isFinished) && (
        <Box sx={{ mt: 4 }}>
          <Stack spacing={4}>
            <TeamDisplay teamName="Siyah Takım" team={blackTeam} />
            <TeamDisplay teamName="Beyaz Takım" team={whiteTeam} />

            <ScoreInputs
              blackScore={blackScore}
              setBlackScore={setBlackScore}
              whiteScore={whiteScore}
              setWhiteScore={setWhiteScore}
              disabled={isAdmin || isFinished}
            />

            {blackScore !== "" && whiteScore !== "" && (
              <PlayersScoreList
                players={allPlayers}
                playerScores={playerScores}
                handleUpdatePlayerScore={handleUpdatePlayerScore}
              />
            )}

            {!isFinished && (
              <Button
                variant="contained"
                disabled={
                  isAdmin ||
                  blackScore === "" ||
                  whiteScore === "" ||
                  allPlayers.length === 0
                }
                sx={{
                  bgcolor: "#000",
                  "&:hover": { bgcolor: "#444" },
                  borderRadius: 2,
                  px: 4,
                  py: 2,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
                onClick={handleFinishWeek}
              >
                Haftayı Bitir
              </Button>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default WeekMatch;
