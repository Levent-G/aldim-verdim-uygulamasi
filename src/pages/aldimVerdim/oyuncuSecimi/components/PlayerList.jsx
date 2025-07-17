import React from "react";
import { Box, Paper, Avatar, Typography, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import getInitials from "../../../utils/getInitials";
import { motion } from "framer-motion";

export default function PlayerList({
  players,
  blackCaptain,
  whiteCaptain,
  selectedCaptains,
  toggleCaptainSelect,
  handleDeletePlayer,
  isDisabled,
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {players.map((player) => {
        const isBlackCaptain = blackCaptain?.id === player.id;
        const isWhiteCaptain = whiteCaptain?.id === player.id;
        const isCaptain = isBlackCaptain || isWhiteCaptain;

        const captainTeamLabel = isBlackCaptain
          ? " (Siyah)"
          : isWhiteCaptain
          ? " (Beyaz)"
          : "";

        return (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Paper
              onClick={() => toggleCaptainSelect(player)}
              sx={{
                cursor: selectedCaptains.length < 2 ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.2,
                borderRadius: 3,
                bgcolor: isCaptain ? "#000" : "#fff",
                color: isCaptain ? "#fff" : "#000",
                border: "1.5px solid #000",
                boxShadow: isCaptain
                  ? "0 0 12px rgba(0,0,0,0.3)"
                  : "0 2px 6px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor:
                    selectedCaptains.length < 2 && !isCaptain
                      ? "#f5f5f5"
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
                }}
              >
                {getInitials(player.name)}
              </Avatar>

              <Typography fontWeight={isCaptain ? 900 : 600}>
                {player.name.toUpperCase()}
              </Typography>

              {isCaptain && (
                <Typography variant="caption" fontWeight="bold" ml="auto">
                  Kaptan{captainTeamLabel}
                </Typography>
              )}

              <Tooltip title="Sil">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePlayer(player.id);
                  }}
                  sx={{ ml: "auto", color: isCaptain ? "#fff" : "#000" }}
                  disabled={isDisabled}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Paper>
          </motion.div>
        );
      })}
    </Box>
  );
}
