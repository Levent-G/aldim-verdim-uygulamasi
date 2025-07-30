import { useCaptainContext } from "../../../context/CaptainContext";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Chip,
  Grid,
  Button,
  useTheme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Captain from "./components/Captain";
import TeamPanel from "./components/TeamPanel";
import PlayerPoolPanel from "./components/PlayerPoolPanel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  captainStepsLeft,
  captainStepsRight,
} from "./shared/teamSelectionStepEnums";


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
    captainPos,
    resetAll,
    setIsFinished,
  } = useCaptainContext();

  const user = JSON.parse(localStorage.getItem("user"));
  
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  
  const isGameOver = playerPool.length === 0;
  
  const teamsInitialized = useRef(false);
  
  const [animating, setAnimating] = useState(false);

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
      setIsFinished(true);
      resetAll();
    }
  }, [isGameOver, user, resetAll, playerPool, setIsFinished]);

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
            position={captainPos.black}
            steps={captainStepsLeft}
            isGameOver={isGameOver}
          />

          <Captain
            side="white"
            name={captainWhite.name}
            active={turn === "beyaz"}
            position={captainPos.white}
            steps={captainStepsRight}
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
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4}>
          <PlayerPoolPanel
            animating={animating}
            setAnimating={setAnimating}
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
