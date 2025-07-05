import React from "react";
import { Container, Typography, Box } from "@mui/material";
import JoinWeekForm from "./components/JoinWeekForm";
import CreateWeekForm from "./components/CreateWeekForm";
import WeekList from "./components/WeekList";

const HaftaOlusturmaMain = ({ onJoin }) => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h3" align="center" gutterBottom>
        🎮 Hafta Sistemi
      </Typography>

      <Box sx={{ mt: 4 }}>
        {/* onJoin callbackini JoinWeekForm'a geçir */}
        <JoinWeekForm onJoin={onJoin} />
      </Box>

      <Box sx={{ mt: 4 }}>
        <CreateWeekForm />
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Aktif Haftalar
        </Typography>
        <WeekList />
      </Box>
    </Container>
  );
};

export default HaftaOlusturmaMain;
