import React from "react";
import { TextField, Button, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";

export default function InputControls({
  name,
  setName,
  addPlayer,
  handleAddAllUsers,
  isDisabled,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

        <Button
          variant="outlined"
          onClick={handleAddAllUsers}
          fullWidth={isMobile}
          disabled={isDisabled}
          sx={{
            borderRadius: 2,
            px: 3,
            fontWeight: "bold",
            textTransform: "none",
            color: "green",
            borderColor: "green",
            "&:hover": {
              bgcolor: "green",
              color: "white",
              borderColor: "green",
            },
          }}
        >
          Tüm Kullanıcıları Ekle
        </Button>
      </Stack>
    </motion.div>
  );
}
