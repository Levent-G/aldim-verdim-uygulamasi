import { Box } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFoundWeek } from "../../hooks/useFoundWeek";
import { useCaptainContext } from "../../../context/CaptainContext";
import Header from "./components/Header";
import WeekMatch from "../haftaninMaci/WeekMatch";
import PlayerList from "./components/PlayerList";
import InputControls from "./components/InputControls";
import ActionButtons from "./components/ActionButtons";

export default function PlayerAndCaptainSelection() {
  const { players, getWeekId } = useCaptainContext();

  const { weekId } = useParams();

  const { isFinished } = useFoundWeek(weekId);

  useEffect(() => {
    if (weekId) {
      getWeekId(weekId);
    }
  }, [weekId, getWeekId]);

  return (
    <Box>
      {!isFinished && (
        <>
          <Header />

          <InputControls />

          {players.length > 0 && <PlayerList />}

          <ActionButtons />
        </>
      )}

      <WeekMatch />
    </Box>
  );
}
