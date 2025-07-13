import React from "react";
import { Box, Typography, Paper, Stack, Avatar } from "@mui/material";

const TeamDisplay = ({ teamName, team }) => {
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
            }}
          >
            <Avatar sx={{ bgcolor: "#000", color: "#fff", mr: 2 }}>
              {player.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </Avatar>
            <Typography>{player.name}</Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default TeamDisplay;
