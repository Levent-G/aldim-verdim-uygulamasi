import React from "react";
import { Paper, Typography, Stack } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import PlayerCard from "./PlayerCard";

export default function TeamPanel({ teamName, players, variant, isXs }) {
  return (
    <Paper
      elevation={4}
      sx={{
        bgcolor: variant === "black" ? "black" : "white",
        borderRadius: 3,
        p: isXs ? 1 : 2,
        minHeight: isXs ? 280 : 400,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowY: "auto",
        color: variant === "black" ? "white" : "black",
        width:300

      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        gutterBottom
        sx={{ textAlign: "center" }}
      >
        {teamName}
      </Typography>
      <Stack spacing={1} width="100%">
        <AnimatePresence>
          {players.map((player, i) => (
            <PlayerCard
              key={player.id}
              player={player}
              isCaptain={i === 0}
              isXs={isXs}
              variant={variant}
            />
          ))}
        </AnimatePresence>
      </Stack>
    </Paper>
  );
}
