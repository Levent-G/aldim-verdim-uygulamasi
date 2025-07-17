import React from "react";
import { Button, Stack } from "@mui/material";
import { motion } from "framer-motion";

export default function ActionButtons({
  handleRandomCaptain,
  handleStartTeam,
  clearCaptains,
  handleClearAllPlayers,
  user,
  selectedCaptains,
  players,
}) {
  const isAdmin = user?.isAdmin;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="center"
        mt={4}
      >
        <Button
          variant="outlined"
          onClick={handleRandomCaptain}
          disabled={!isAdmin || players.length < 2}
          sx={{
            borderColor: "#000",
            color: "#000",
            "&:hover": { bgcolor: "#000", color: "#fff" },
            borderRadius: 2,
            px: 4,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Rastgele Kaptan Seç
        </Button>

        <Button
          variant="contained"
          onClick={handleStartTeam}
          disabled={!isAdmin || selectedCaptains.length !== 2}
          sx={{
            bgcolor: "#000",
            "&:hover": { bgcolor: "#444" },
            borderRadius: 2,
            px: 4,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Takımı Hazırla
        </Button>

        <Button
          variant="outlined"
          onClick={clearCaptains}
          disabled={!isAdmin}
          sx={{
            borderColor: "#999",
            color: "#555",
            "&:hover": { bgcolor: "#eee", borderColor: "#777" },
            borderRadius: 2,
            px: 3,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Seçimi Sıfırla
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={handleClearAllPlayers}
          disabled={!isAdmin || selectedCaptains.length > 1}
          sx={{
            borderColor: "red",
            color: "red",
            "&:hover": { bgcolor: "red", color: "white" },
            borderRadius: 2,
            px: 3,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Tümünü Sil
        </Button>
      </Stack>
    </motion.div>
  );
}
