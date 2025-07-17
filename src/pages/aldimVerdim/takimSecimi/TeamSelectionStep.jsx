import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  Button,
  Chip,
} from "@mui/material";
import Captain from "./components/Captain";
import TeamPanel from "./components/TeamPanel";
import PlayerPoolPanel from "./components/PlayerPoolPanel";
import { useCaptainContext } from "../../../context/CaptainContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const captainStepsLeft = [-300, -250, -200, -150, -100, -50, -20];
const captainStepsRight = [300, 250, 200, 150, 100, 50, 20];

// Burada "siyah" ve "beyaz" string'lerini
// captainPos key'lerine dönüştürmek için haritalama yapıyoruz.
const turnToKeyMap = {
  siyah: "black",
  beyaz: "white",
};

export default function TeamSelectionStep() {
  const {
    blackCaptain,
    whiteCaptain,
    playerPool,
    setPlayerPool,
    blackTeam,
    setBlackTeam,
    whiteTeam,
    setWhiteTeam,
    turn,
    setTurn,
    captainPos,
    setCaptainPos,
    animatingCaptain,
    setAnimatingCaptain,
    resetAll,
    setBlackDoneTeam,
    setWhiteDoneTeam,
    isCaptain,
  } = useCaptainContext();

  const user = JSON.parse(localStorage.getItem("user"));
  const [animating, setAnimating] = useState(false);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const isGameOver = playerPool.length === 0;

  const teamsInitialized = useRef(false);

  useEffect(() => {
    if (!teamsInitialized.current && blackCaptain && whiteCaptain) {
      setBlackTeam([{ ...blackCaptain, kaptanMi: true }]);
      setWhiteTeam([{ ...whiteCaptain, kaptanMi: true }]);

      const newPool = playerPool.filter(
        (player) =>
          player.id !== blackCaptain.id && player.id !== whiteCaptain.id
      );
      setPlayerPool(newPool);

      teamsInitialized.current = true;
    }
  }, [
    blackCaptain,
    whiteCaptain,
    playerPool,
    setBlackTeam,
    setWhiteTeam,
    setPlayerPool,
  ]);

  useEffect(() => {
    if (isGameOver) {
      resetAll();
    }
  }, [isGameOver, user, resetAll,playerPool]);

  const captainBlack = {
    name: blackTeam[0]?.name || "Kaptan Siyah",
    avatar:
      blackTeam[0]?.avatar ||
      "https://cdn-icons-png.flaticon.com/512/4140/4140047.png",
  };

  const captainWhite = {
    name: whiteTeam[0]?.name || "Kaptan Beyaz",
    avatar:
      whiteTeam[0]?.avatar ||
      "https://cdn-icons-png.flaticon.com/512/4140/4140049.png",
  };

  const selectPlayer = (player) => {
    if (isCaptain && user?.rank === turn) {
      if (animating || isGameOver || !blackTeam[0] || !whiteTeam[0]) return;

      setAnimating(true);
      setAnimatingCaptain(turn);

      const totalSelected = blackTeam.length + whiteTeam.length;

      // Burada turn'u captainPos key'ine çeviriyoruz:
      const captainKey = turnToKeyMap[turn];

      // Eğer captainKey yoksa hata olmasın diye 0 kabul et
      const currentPos =
        typeof captainPos[captainKey] === "number" ? captainPos[captainKey] : 0;
      let nextStep = currentPos + 1;

      if (totalSelected + 1 === 14) {
        nextStep = 6;
      }

      const newCaptainPos = { ...captainPos, [captainKey]: nextStep };

      setTimeout(() => {
        if (turn === "siyah" && blackTeam.length < 7) {
          const newBlackTeam = [...blackTeam, player];
          setBlackTeam(newBlackTeam);
          setBlackDoneTeam(newBlackTeam);
        }

        if (turn === "beyaz" && whiteTeam.length < 7) {
          const newWhiteTeam = [...whiteTeam, player];
          setWhiteTeam(newWhiteTeam);
          setWhiteDoneTeam(newWhiteTeam);
        }

        const newPool = playerPool.filter((p) => p.id !== player.id);
        setPlayerPool(newPool);

        setCaptainPos(newCaptainPos);

        if (totalSelected + 1 === 14) {
          setTurn(turn);
        } else {
          const newTurn = turn === "siyah" ? "beyaz" : "siyah";
          setTurn(newTurn);
        }

        setAnimatingCaptain(null);
        setAnimating(false);
      }, 700);
    }
  };

  return (
    <Box
      sx={{
        p: isXs ? 2 : 3,
        maxWidth: 1400,
        margin: "auto",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: isXs ? 2 : 3,
      }}
    >
      <Typography
        variant={isXs ? "h5" : "h4"}
        textAlign="center"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        GIB ALDIM VERDİM
      </Typography>

      <Typography
        variant={isXs ? "subtitle1" : "h6"}
        textAlign="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: turn === "siyah" ? "#000" : "#444",
        }}
      >
        {!isGameOver
          ? `Sıra ${turn === "siyah" ? "Siyah Takım" : "Beyaz Takım"}'da`
          : "Takımlar Tamamlandı! 🎉"}
      </Typography>

      {/* Eğer mobil değilse animasyon alanını göster */}
      {!isXs && (
        <Box
          sx={{
            position: "relative",
            height: 320,
            background: `linear-gradient(
        to right,
        #f5f5f5 0%,
        #e0e0e0 50%,
        #212121 50%,
        #424242 100%
      )`,
            borderRadius: 3,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: 6,
            px: 0,
            py: 0,
            pb: 4,
          }}
        >
          <Captain
            side="black"
            name={captainBlack.name}
            active={turn === "siyah"}
            animatingCaptain={animatingCaptain}
            position={captainPos.black}
            steps={captainStepsLeft}
            isGameOver={isGameOver}
          />

          <Captain
            side="white"
            name={captainWhite.name}
            active={turn === "beyaz"}
            animatingCaptain={animatingCaptain}
            position={captainPos.white}
            steps={captainStepsRight}
            isGameOver={isGameOver}
          />
        </Box>
      )}

      <Grid container spacing={isXs ? 2 : 3} justifyContent="center">
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <TeamPanel
            teamName={
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    fontFamily: "Comic Sans MS, cursive",
                  }}
                >
                  Siyah Takım
                </Typography>

                {turn === "siyah" &&
                  !isGameOver &&
                  user?.rank === "siyah" &&
                  user?.isCaptain && (
                    <Chip
                      label="Sıra sende"
                      color="success"
                      icon={<CheckCircleIcon />}
                      sx={{
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                        height: "32px",
                      }}
                    />
                  )}
              </Box>
            }
            players={blackTeam}
            variant="black"
            isXs={isXs}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4}>
          <PlayerPoolPanel
            playersPool={playerPool}
            selectPlayer={selectPlayer}
            isXs={isXs}
            animating={animating}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4}>
          <TeamPanel
            teamName={
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    fontFamily: "Comic Sans MS, cursive",
                  }}
                >
                  Beyaz Takım
                </Typography>

                {turn === "beyaz" &&
                  !isGameOver &&
                  user?.rank === "beyaz" &&
                  user?.isCaptain && (
                    <Chip
                      label="Sıra sende"
                      color="success"
                      icon={<CheckCircleIcon />}
                      sx={{
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                        height: "32px",
                      }}
                    />
                  )}
              </Box>
            }
            players={whiteTeam}
            variant="white"
            isXs={isXs}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 4,
        }}
      >
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            if (user?.isAdmin) resetAll();
          }}
          sx={{
            borderRadius: 2,
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
          disabled={!user?.isAdmin}
        >
          Geri Dön
        </Button>
      </Box>
    </Box>
  );
}
