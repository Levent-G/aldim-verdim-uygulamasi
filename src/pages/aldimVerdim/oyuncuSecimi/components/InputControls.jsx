import React from "react";
import { TextField, Button, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

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
    <Stack
      direction={isMobile ? "column" : "row"}
      spacing={isMobile ? 2 : 1}
      mb={4}
      alignItems={"center"}
      justifyContent={"center"}
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
        sx={{
          "& .MuiInputBase-root": { borderRadius: 1 },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#000",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#000",
          },
        }}
      />
      <Button
        variant="contained"
        onClick={addPlayer}
        disabled={isDisabled}
        fullWidth={isMobile}
        sx={{
          bgcolor: "#000",
          "&:hover": { bgcolor: "#222" },
          borderRadius: 1,
          px: 3,
          textTransform: "uppercase",
          fontWeight: "bold",
          width: isMobile ? "100%" : "auto",
        }}
      >
        Ekle
      </Button>
      <Button
        variant="outlined"
        color="success"
        onClick={handleAddAllUsers}
        sx={{
          borderColor: "green",
          color: "green",
          "&:hover": { bgcolor: "green", color: "white" },
          borderRadius: 1,
          px: 3,
          fontWeight: "bold",
          width: isMobile ? "100%" : "auto",
        }}
        fullWidth={isMobile}
        disabled={isDisabled}
      >
        Tüm Kullanıcıları Ekle
      </Button>
    </Stack>
  );
}
