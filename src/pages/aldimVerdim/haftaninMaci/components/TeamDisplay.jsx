import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  IconButton,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import OyuncuDegistirModal from "./OyuncuDegistirModal";
import { useCaptainContext } from "../../../../context/CaptainContext";

const TeamDisplay = ({ teamName, team, currentWeek }) => {
  const { setBlackTeam, setWhiteTeam } = useCaptainContext();

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleReplace = (oldPlayer, newName) => {
    const newPlayer = {
      ...oldPlayer,
      name: newName,
    };

    const updatedTeam = team.map((p) =>
      p.id === oldPlayer.id ? newPlayer : p
    );

    if (teamName.includes("Siyah")) {
      setBlackTeam(updatedTeam);
    } else {
      setWhiteTeam(updatedTeam);
    }
  };

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}
      >
        {teamName}
      </Typography>
      <Stack spacing={1}>
        {team.map((player) => (
          <Paper
            key={player.id}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              borderRadius: 2,
              bgcolor: "#f0f0f0",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ bgcolor: "#000", color: "#fff", mr: 2 }}>
                {player.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </Avatar>
              <Typography>{player.name}</Typography>
            </Box>
            {!currentWeek?.isFinished && (
              <IconButton
                onClick={() => {
                  setSelectedPlayer(player);
                  setModalOpen(true);
                }}
              >
                <SwapHorizIcon />
              </IconButton>
            )}
          </Paper>
        ))}
      </Stack>

      {selectedPlayer && (
        <OyuncuDegistirModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          player={selectedPlayer}
          onReplace={handleReplace}
        />
      )}
    </Box>
  );
};

export default TeamDisplay;
