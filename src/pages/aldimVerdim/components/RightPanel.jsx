import React from "react";
import { Box, Paper } from "@mui/material";
import { motion } from "framer-motion";
import PlayerAndCaptainSelection from "../oyuncuSecimi/PlayerAndCaptainSelection";
import TeamSelectionStep from "../takimSecimi/TeamSelectionStep";
import { useCaptainContext } from "../../../context/CaptainContext";

const RightPanel = ({ isMobile, users, isFinished }) => {
  const { isAdmin, isTeamOk } = useCaptainContext();

  return (
    <Box
      flex={1}
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={!isMobile && 4}
      mt={isMobile && 5}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: "100%" }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            minHeight: "500px",
            borderRadius: 5,
            bgcolor: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(6px)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          }}
        >
          {!isTeamOk ? (
            <PlayerAndCaptainSelection
              isAdmin={isAdmin}
              users={users}
              isFinished={isFinished}
            />
          ) : (
            <TeamSelectionStep />
          )}
        </Paper>
      </motion.div>
    </Box>
  );
};

export default RightPanel;
