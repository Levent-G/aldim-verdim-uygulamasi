import { motion } from "framer-motion";
import { Button, Stack } from "@mui/material";
import { useCaptainContext } from "../../../../context/CaptainContext";

export default function ActionButtons() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.isAdmin === true;

  const {
    players,
    blackCaptain,
    whiteCaptain,
    setPlayerPool,
    clearCaptains,
    setIsTeamOk,
  } = useCaptainContext();

  const selectedCaptains = [blackCaptain, whiteCaptain].filter(Boolean);
  console.log(selectedCaptains)
  const isDisabled = selectedCaptains.length === 2;


  const handleStartTeam = () => {
    if (!isAdmin) return;
    if (!blackCaptain || !whiteCaptain) {
      alert("Lütfen 2 kaptan seçin ya da rastgele seçin.");
      return;
    }
    const poolCopy = players.filter(
      (p) => p.id !== blackCaptain?.id && p.id !== whiteCaptain?.id
    );
    setPlayerPool(poolCopy);
    setIsTeamOk(true);
  };

 

 

  if (!isAdmin) return null; // sadece admin görebilir

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="center"
        mt={4}
      >
       

        <Button
          variant="contained"
          onClick={handleStartTeam}
          disabled={!isDisabled}
          sx={{
            bgcolor: "#000",
            "&:hover": { bgcolor: "#444" },
            borderRadius: 2,
            px: 4,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Takımı Hazırla
        </Button>

        <Button
          variant="outlined"
          onClick={clearCaptains}
          sx={{
            borderColor: "#999",
            color: "#555",
            "&:hover": { bgcolor: "#eee", borderColor: "#777" },
            borderRadius: 2,
            px: 3,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Seçimi Sıfırla
        </Button>

      
      </Stack>
    </motion.div>
  );
}
