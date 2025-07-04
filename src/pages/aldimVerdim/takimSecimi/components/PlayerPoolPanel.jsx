import React from "react";
import { Paper, Typography, Stack } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import PlayerCard from "./PlayerCard";

export default function PlayerPoolPanel({
  playersPool,
  selectPlayer,
  isXs,
  animating,
}) {
  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: 3,
        p: isXs ? 1 : 2,
        minHeight: isXs ? 280 : 400,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width:300
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        gutterBottom
        sx={{ textAlign: "center" }}
      >
        Oyuncu Havuzu
      </Typography>
      {playersPool.length === 0 ? (
        <Typography
          mt={4}
          color="success.main"
          fontWeight="bold"
          textAlign="center"
        >
          Takımlar tamamlandı! 🎉
        </Typography>
      ) : (
        <Stack
          spacing={1}
          width="100%"
        >
          <AnimatePresence>
            {playersPool.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onClick={() => selectPlayer(player)}
                isXs={isXs}
                animating={animating}
              />
            ))}
          </AnimatePresence>
        </Stack>
      )}
    </Paper>
  );
}
