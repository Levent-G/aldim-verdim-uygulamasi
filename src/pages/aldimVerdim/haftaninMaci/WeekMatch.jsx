import { useFoundWeek } from "../../hooks/useFoundWeek";
import { useCaptainContext } from "../../../context/CaptainContext";
import { Box, Button, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import TeamDisplay from "./components/TeamDisplay";
import ScoreInputs from "./components/ScoreInputs";
import TeamPlaceholder from "./components/TeamPlaceholder";
import PlayersScoreList from "./components/PlayersScoreList";

const WeekMatch = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const { blackTeam, whiteTeam, weeks, weekId, setWeeks, playerPool } =
    useCaptainContext();

  const { foundedWeek, isFinished } = useFoundWeek(weekId);

  const isGameOver = playerPool.length === 0;

  const [showTeams, setShowTeams] = useState(isGameOver ? true : false);
  const [blackScore, setBlackScore] = useState(foundedWeek?.blackScore || "");
  const [whiteScore, setWhiteScore] = useState(foundedWeek?.whiteScore || "");
  const [playerScores, setPlayerScores] = useState([]);

  useEffect(() => {
    if (!foundedWeek) return;

    if (foundedWeek.blackScore != null) {
      setBlackScore(foundedWeek.blackScore ?? "");
    }
    if (foundedWeek.whiteScore != null) {
      setWhiteScore(foundedWeek.whiteScore ?? "");
    }
    if (foundedWeek.playersDetails?.length > 0) {
      const scores = foundedWeek.playersDetails.map((p) => ({
        id: p.id,
        score: p.score,
      }));
      setPlayerScores(scores);
    }
  }, [weekId, weeks, blackTeam, whiteTeam, foundedWeek]);

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
          fontSize: "13px",
          width: "100%",
          fontWeight: "bold",
          letterSpacing: "1px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
        disabled
      >
        Haftanın Maçı Kadroları
      </Button>

      {(showTeams || isFinished) && (
        <Box sx={{ mt: 4 }}>
          <Stack spacing={4}>
            {blackTeam.length > 0 ? (
              <TeamDisplay teamName="Siyah Takım" team={blackTeam} />
            ) : (
              <TeamPlaceholder teamName="Siyah Takım" />
            )}

            {whiteTeam.length > 0 ? (
              <TeamDisplay teamName="Beyaz Takım" team={whiteTeam} />
            ) : (
              <TeamPlaceholder teamName="Beyaz Takım" />
            )}

            {whiteTeam.length > 0 && blackTeam.length > 0 && (
              <ScoreInputs
                blackScore={blackScore}
                setBlackScore={setBlackScore}
                whiteScore={whiteScore}
                setWhiteScore={setWhiteScore}
              />
            )}

            {blackScore !== "" && whiteScore !== "" && (
              <PlayersScoreList
                players={allPlayers}
                playerScores={playerScores}
                setPlayerScores={setPlayerScores}
              />
            )}

            {!isFinished && whiteTeam.length > 0 && blackTeam.length > 0 && (
              <Button
                variant="contained"
                disabled={
                  user?.isAdmin === false ||
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
