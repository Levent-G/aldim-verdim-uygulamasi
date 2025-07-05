import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Avatar,
  Paper,
  IconButton,
} from "@mui/material";
import { useCaptainContext } from "../../../context/CaptainContext";
import FootballerSVG from "../takimSecimi/components/FootballerSVG";
import DeleteIcon from "@mui/icons-material/Delete";
import WeekMatch from "../haftaninMaci/WeekMatch";
import { useParams } from "react-router-dom";

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function PlayerAndCaptainSelection({ isAdmin }) {
  const {
    players,
    setPlayers,
    blackCaptain,
    setBlackCaptain,
    whiteCaptain,
    setWhiteCaptain,
    setPlayerPool,
    clearCaptains,
    setIsTeamOk,
    deleteAll,
    getWeekId,
  } = useCaptainContext();
  const [name, setName] = useState("");

  const { weekId } = useParams();

  const selectedCaptains = [blackCaptain, whiteCaptain].filter(Boolean);

  useEffect(() => {
    if (weekId) {
      getWeekId(weekId);
    }
  }, [weekId, getWeekId]);

  const addPlayer = () => {
    if (isAdmin) {
      const trimmed = name.trim();
      if (!trimmed) return;
      setPlayers([...players, { id: Date.now(), name: trimmed, avatar: "" }]);
      setName("");
    }
  };

  const toggleCaptainSelect = (player) => {
    if (isAdmin) {
      const isAlreadySelected =
        blackCaptain?.id === player.id || whiteCaptain?.id === player.id;

      if (isAlreadySelected) {
        if (blackCaptain?.id === player.id) setBlackCaptain(null);
        else if (whiteCaptain?.id === player.id) setWhiteCaptain(null);
      } else {
        if (!blackCaptain) {
          setBlackCaptain(player);
        } else if (!whiteCaptain) {
          setWhiteCaptain(player);
        }
      }
    }
  };

  const handleRandomCaptain = () => {
    if (isAdmin) {
      if (players.length < 2) {
        alert("En az 2 oyuncu olmalı.");
        return;
      }

      // Rastgele iki farklı index seç
      let firstIndex = Math.floor(Math.random() * players.length);
      let secondIndex;

      do {
        secondIndex = Math.floor(Math.random() * players.length);
      } while (secondIndex === firstIndex);

      const rand1 = players[firstIndex];
      const rand2 = players[secondIndex];

      // Kalan oyuncuları filtrele
      const poolCopy = players.filter(
        (p) => p.id !== rand1.id && p.id !== rand2.id
      );

      setBlackCaptain(rand1);
      setWhiteCaptain(rand2);
      setPlayerPool(poolCopy);
    }
  };

  const handleStartTeam = () => {
    if (isAdmin) {
      if (!blackCaptain || !whiteCaptain) {
        alert("Lütfen 2 kaptan seçin ya da rastgele seçin.");
        return;
      }
      const poolCopy = players.filter(
        (p) => p.id !== blackCaptain?.id && p.id !== whiteCaptain?.id
      );
      setPlayerPool(poolCopy);
      setIsTeamOk(true);
    }
  };

  const handleDeletePlayer = (playerId) => {
    if (isAdmin) {
      const filterPlayer = players.filter((p) => p.id !== playerId);
      setPlayers(filterPlayer);
      if (blackCaptain?.id === playerId) setBlackCaptain(null);
      if (whiteCaptain?.id === playerId) setWhiteCaptain(null);
    }
  };

  const handleClearAllPlayers = () => {
    if (isAdmin) {
      if (
        !window.confirm("Tüm oyuncular ve kaptanlar silinecek. Emin misiniz?")
      )
        return;

      deleteAll();
    }
  };

  return (
    <Box>
      <Typography
        component="div"
        textAlign="center"
        sx={{
          fontWeight: "900",
          mb: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <FootballerSVG color="black" />
        <Typography variant="h5" component="span" sx={{ fontWeight: "900" }}>
          Oyuncu & Kaptan Seçimi
        </Typography>
        <FootballerSVG color="white" />
      </Typography>

      <Stack direction="row" spacing={1} mb={4}>
        <TextField
          fullWidth
          label="Oyuncu Adı"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addPlayer()}
          disabled={isAdmin === false || selectedCaptains.length > 1}
          sx={{
            "& .MuiInputBase-root": { borderRadius: 1 },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#000",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#000",
            },
          }}
        />
        <Button
          variant="contained"
          onClick={addPlayer}
          disabled={isAdmin === false || selectedCaptains.length > 1}
          sx={{
            bgcolor: "#000",
            "&:hover": { bgcolor: "#222" },
            borderRadius: 1,
            px: 3,
            textTransform: "uppercase",
            fontWeight: "bold",
          }}
        >
          Ekle
        </Button>
      </Stack>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {players.map((player) => {
          const isCaptain =
            blackCaptain?.id === player.id || whiteCaptain?.id === player.id;

          return (
            <Paper
              key={player.id}
              onClick={() => toggleCaptainSelect(player)}
              sx={{
                cursor: selectedCaptains.length < 2 ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1,
                borderRadius: 2,
                bgcolor: isCaptain ? "#000" : "#fff",
                color: isCaptain ? "#fff" : "#000",
                border: "1.5px solid #000",
                boxShadow: isCaptain
                  ? "0 0 10px 3px #000"
                  : "0 2px 6px rgba(0,0,0,0.1)",
                transition: "all 0.3s",
                userSelect: "none",
                "&:hover": {
                  bgcolor:
                    selectedCaptains.length < 2 && !isCaptain
                      ? "#f5f5f5"
                      : undefined,
                  boxShadow:
                    selectedCaptains.length < 2 && !isCaptain
                      ? "0 0 8px rgba(0,0,0,0.3)"
                      : undefined,
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: isCaptain ? "#fff" : "#000",
                  color: isCaptain ? "#000" : "#fff",
                  fontWeight: "900",
                  width: 40,
                  height: 40,
                  fontSize: 18,
                }}
              >
                {getInitials(player.name)}
              </Avatar>
              <Typography
                sx={{
                  fontWeight: isCaptain ? "900" : "600",
                  fontSize: 16,
                  userSelect: "none",
                }}
              >
                {player.name.toUpperCase()}
              </Typography>
              {isCaptain && (
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: "bold",
                    ml: "auto",
                    userSelect: "none",
                  }}
                >
                  Kaptan
                </Typography>
              )}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePlayer(player.id);
                }}
                sx={{
                  marginLeft: "auto",
                  color: isCaptain ? "#fff" : "#000",
                }}
                disabled={isAdmin === false || selectedCaptains.length > 1}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Paper>
          );
        })}
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="center"
        mt={4}
      >
        {/* Diğer butonlar */}
        <Button
          variant="outlined"
          onClick={handleRandomCaptain}
          disabled={isAdmin === false || players.length < 2}
          sx={{
            borderColor: "#000",
            color: "#000",
            "&:hover": { bgcolor: "#000", color: "#fff" },
            borderRadius: 1,
            px: 4,
            textTransform: "uppercase",
            fontWeight: "bold",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Rastgele Kaptan Seç
        </Button>

        <Button
          variant="contained"
          onClick={handleStartTeam}
          disabled={isAdmin === false || selectedCaptains.length !== 2}
          sx={{
            bgcolor: "#000",
            "&:hover": { bgcolor: "#444" },
            borderRadius: 1,
            px: 4,
            textTransform: "uppercase",
            fontWeight: "bold",
            color: "#fff",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Takımı Hazırla
        </Button>

        <Button
          variant="outlined"
          onClick={clearCaptains}
          sx={{
            borderColor: "#999",
            color: "#555",
            "&:hover": { bgcolor: "#eee", borderColor: "#777" },
            borderRadius: 1,
            px: 3,
            fontWeight: "bold",
            width: { xs: "100%", sm: "auto" },
          }}
          disabled={isAdmin === false}
        >
          Seçimi Sıfırla
        </Button>

        {/* Yeni buton */}
        <Button
          variant="outlined"
          color="error"
          onClick={handleClearAllPlayers}
          sx={{
            borderColor: "red",
            color: "red",
            "&:hover": { bgcolor: "red", color: "white" },
            borderRadius: 1,
            px: 3,
            fontWeight: "bold",
            width: { xs: "100%", sm: "auto" },
          }}
          disabled={isAdmin === false || selectedCaptains.length > 1}
        >
          Tümünü Sil
        </Button>
      </Stack>
      <WeekMatch />
    </Box>
  );
}
