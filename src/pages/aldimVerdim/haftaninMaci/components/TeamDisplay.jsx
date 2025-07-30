import { useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Avatar,
  Typography,
  IconButton,
} from "@mui/material";
import { useFoundWeek } from "../../../hooks/useFoundWeek";
import { useCaptainContext } from "../../../../context/CaptainContext";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import OyuncuDegistirModal from "./OyuncuDegistirModal";

const TeamDisplay = ({ teamName, team }) => {
  const { weekId } = useCaptainContext();

  const { foundedWeek } = useFoundWeek(weekId);

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
            {!foundedWeek?.isFinished && (
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
          team={team}
          teamName={teamName}
        />
      )}
    </Box>
  );
};

export default TeamDisplay;
