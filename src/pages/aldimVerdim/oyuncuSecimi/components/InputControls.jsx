import { motion } from "framer-motion";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useCaptainContext } from "../../../../context/CaptainContext";
import { TextField, Button, Stack, useMediaQuery } from "@mui/material";

export default function InputControls() {
  const user = JSON.parse(localStorage.getItem("user"));

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { players, setPlayers, blackCaptain, whiteCaptain } =
    useCaptainContext();
  const selectedCaptains = [blackCaptain, whiteCaptain].filter(Boolean);
  const isDisabled = user?.isAdmin === false || selectedCaptains.length > 1;

  const [name, setName] = useState("");

  const addPlayer = () => {
    if (user.isAdmin) {
      const trimmed = name.trim();
      if (!trimmed) return;
      setPlayers([...players, { id: Date.now(), name: trimmed, avatar: "" }]);
      setName("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={2}
        mb={4}
        alignItems="center"
        justifyContent="center"
        width="100%"
      >
        {!isDisabled && (
          <>
            <TextField
              label="Oyuncu Adı"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPlayer()}
              disabled={isDisabled}
              fullWidth={isMobile}
            />

            <Button
              variant="contained"
              onClick={addPlayer}
              disabled={isDisabled}
              fullWidth={isMobile}
              sx={{
                bgcolor: "#222",
                borderRadius: 2,
                px: 3,
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": { bgcolor: "#000" },
              }}
            >
              Ekle
            </Button>
          </>
        )}
      </Stack>
    </motion.div>
  );
}
