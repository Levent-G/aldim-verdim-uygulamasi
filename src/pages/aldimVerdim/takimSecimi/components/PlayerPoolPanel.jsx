import {
  Stack,
  Paper,
  useTheme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { turnToKeyMap } from "../shared/teamSelectionStepEnums";
import { AnimatePresence } from "framer-motion";
import { useCaptainContext } from "../../../../context/CaptainContext";
import PlayerCard from "./PlayerCard";

export default function PlayerPoolPanel({ animating, setAnimating }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    playerPool,
    setPlayerPool,
    blackTeam,
    setBlackTeam,
    whiteTeam,
    setWhiteTeam,
    turn,
    setTurn,
    captainPos,
    setCaptainPos,
    setAnimatingCaptain,
    setBlackDoneTeam,
    setWhiteDoneTeam,
    isCaptain,
  } = useCaptainContext();

  const isGameOver = playerPool.length === 0;

  const selectPlayer = (player) => {
    if (isCaptain && user?.rank === turn) {
      if (animating || isGameOver || !blackTeam[0] || !whiteTeam[0]) return;

      setAnimating(true);
      setAnimatingCaptain(turn);

      const totalSelected = blackTeam.length + whiteTeam.length;

      // Burada turn'u captainPos key'ine çeviriyoruz:
      const captainKey = turnToKeyMap[turn];

      // Eğer captainKey yoksa hata olmasın diye 0 kabul et
      const currentPos =
        typeof captainPos[captainKey] === "number" ? captainPos[captainKey] : 0;
      let nextStep = currentPos + 1;

      if (totalSelected + 1 === 14) {
        nextStep = 6;
      }

      const newCaptainPos = { ...captainPos, [captainKey]: nextStep };

      setTimeout(() => {
        if (turn === "siyah" && blackTeam.length < 7) {
          const newBlackTeam = [...blackTeam, player];
          setBlackTeam(newBlackTeam);
          setBlackDoneTeam(newBlackTeam);
        }

        if (turn === "beyaz" && whiteTeam.length < 7) {
          const newWhiteTeam = [...whiteTeam, player];
          setWhiteTeam(newWhiteTeam);
          setWhiteDoneTeam(newWhiteTeam);
        }

        const newPool = playerPool.filter((p) => p.id !== player.id);
        setPlayerPool(newPool);

        setCaptainPos(newCaptainPos);

        if (totalSelected + 1 === 14) {
          setTurn(turn);
        } else {
          const newTurn = turn === "siyah" ? "beyaz" : "siyah";
          setTurn(newTurn);
        }

        setAnimatingCaptain(null);
        setAnimating(false);
      }, 700);
    }
  };
  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: 3,
        p: isXs ? 1 : 2,
        minHeight: isXs ? 280 : 400,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 300,
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        gutterBottom
        sx={{ textAlign: "center" }}
      >
        Oyuncu Havuzu
      </Typography>
      {playerPool.length === 0 ? (
        <Typography
          mt={4}
          color="success.main"
          fontWeight="bold"
          textAlign="center"
        >
          Takımlar tamamlandı! 🎉
        </Typography>
      ) : (
        <Stack spacing={1} width="100%">
          <AnimatePresence>
            {playerPool.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onClick={() => selectPlayer(player)}
                animating={animating}
              />
            ))}
          </AnimatePresence>
        </Stack>
      )}
    </Paper>
  );
}
