import React from "react";
import { Button, Stack } from "@mui/material";

export default function ActionButtons({
  handleRandomCaptain,
  handleStartTeam,
  clearCaptains,
  handleClearAllPlayers,
  user,
  selectedCaptains,
  players,
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      justifyContent="center"
      mt={4}
    >
      <Button
        variant="outlined"
        onClick={handleRandomCaptain}
        disabled={user?.isAdmin === false || players.length < 2}
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
        disabled={user?.isAdmin === false || selectedCaptains.length !== 2}
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
        disabled={user?.isAdmin === false}
      >
        Seçimi Sıfırla
      </Button>

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
        disabled={user?.isAdmin === false || selectedCaptains.length > 1}
      >
        Tümünü Sil
      </Button>
    </Stack>
  );
}
