import React from "react";
import { Box, Paper, Avatar, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import getInitials from "../../../utils/getInitials";

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {players.map((player) => {
        const isBlackCaptain = blackCaptain?.id === player.id;
        const isWhiteCaptain = whiteCaptain?.id === player.id;
        const isCaptain = isBlackCaptain || isWhiteCaptain;

        // Hangi takım kaptanıysa gösterilecek label
        const captainTeamLabel = isBlackCaptain
          ? " (Siyah)"
          : isWhiteCaptain
          ? " (Beyaz)"
          : "";

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
                Kaptan{captainTeamLabel}
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
              disabled={isDisabled}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Paper>
        );
      })}
    </Box>
  );
}
