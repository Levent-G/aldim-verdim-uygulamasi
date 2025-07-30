import { useFoundWeek } from "../../../hooks/useFoundWeek";
import { useCaptainContext } from "../../../../context/CaptainContext";
import { Stack, TextField, Box, Typography } from "@mui/material";

const ScoreInputs = ({
  blackScore,
  setBlackScore,
  whiteScore,
  setWhiteScore,
}) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const { weekId } = useCaptainContext();

  const { isFinished } = useFoundWeek(weekId);

  const disabled = user?.isAdmin === false || isFinished;

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={4}
      justifyContent="center"
      alignItems="center"
      sx={{ mt: 3 }}
    >
      {/* Siyah Takım Skoru */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #111, #333)",
          p: 3,
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
          width: { xs: "100%", sm: 250 },
          // disabled input renkleri için
          "& .Mui-disabled": {
            WebkitTextFillColor: "#eee !important",
            color: "#eee !important",
            opacity: 1,
            textAlign: "center",
          },
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ color: "#fff", fontWeight: "bold", mb: 1, textAlign: "center" }}
        >
          Siyah Takım Skoru
        </Typography>
        <TextField
          variant="outlined"
          type="number"
          value={blackScore}
          onChange={(e) => setBlackScore(e.target.value)}
          disabled={disabled}
          fullWidth
          InputProps={{
            sx: {
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#fff",
            },
          }}
          InputLabelProps={{
            sx: { color: "#ccc" },
          }}
        />
      </Box>

      {/* Beyaz Takım Skoru */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #fff, #ddd)",
          p: 3,
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
          width: { xs: "100%", sm: 250 },
          "& .Mui-disabled": {
            WebkitTextFillColor: "#444 !important",
            color: "#444 !important",
            opacity: 1,
            textAlign: "center",
          },
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: "#000",
            fontWeight: "bold",
            mb: 1,
            textAlign: "center",
          }}
        >
          Beyaz Takım Skoru
        </Typography>
        <TextField
          variant="outlined"
          type="number"
          value={whiteScore}
          onChange={(e) => setWhiteScore(e.target.value)}
          disabled={disabled}
          fullWidth
          InputProps={{
            sx: {
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#000",
            },
          }}
          InputLabelProps={{
            sx: { color: "#666" },
          }}
        />
      </Box>
    </Stack>
  );
};

export default ScoreInputs;
