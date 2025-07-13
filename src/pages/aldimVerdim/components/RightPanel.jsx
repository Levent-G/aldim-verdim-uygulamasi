import React from "react";
import { Box, Paper } from "@mui/material";
import PlayerAndCaptainSelection from "../oyuncuSecimi/PlayerAndCaptainSelection";
import TeamSelectionStep from "../takimSecimi/TeamSelectionStep";
import { useCaptainContext } from "../../../context/CaptainContext";

const RightPanel = ({ isMobile, users,isFinished }) => {
  const { isAdmin, isTeamOk } = useCaptainContext();

  return (
    <Box
      flex={1}
      width={"100%"}
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={!isMobile && 4}
      mt={isMobile && 5}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          minHeight: "500px",
          borderRadius: 5,
          bgcolor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(4px)",
          p: isMobile ? 2 : 4,
        }}
      >
        {!isTeamOk ? (
          <PlayerAndCaptainSelection isAdmin={isAdmin} users={users} isFinished={isFinished} />
        ) : (
          <TeamSelectionStep />
        )}
      </Paper>
    </Box>
  );
};

export default RightPanel;
