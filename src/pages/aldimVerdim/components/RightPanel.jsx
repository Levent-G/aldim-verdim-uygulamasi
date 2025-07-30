import { motion } from "framer-motion";
import { useCaptainContext } from "../../../context/CaptainContext";
import { Box, Paper, useMediaQuery, useTheme } from "@mui/material";
import TeamSelectionStep from "../takimSecimi/TeamSelectionStep";
import PlayerAndCaptainSelection from "../oyuncuSecimi/PlayerAndCaptainSelection";

const RightPanel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { isTeamOk } = useCaptainContext();


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
