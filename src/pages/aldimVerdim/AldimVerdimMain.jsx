import React from "react";
import { useCaptainContext } from "../../context/CaptainContext";
import PlayerAndCaptainSelection from "./oyuncuSecimi/PlayerAndCaptainSelection";
import TeamSelectionStep from "./takimSecimi/TeamSelectionStep";

const AldimVerdimMain = () => {
  const { isTeamOk, setIsTeamOk } = useCaptainContext();

  return (
    <div>
      {!isTeamOk ? (
        <PlayerAndCaptainSelection setIsTeamOk={setIsTeamOk} />
      ) : (
        <TeamSelectionStep setIsTeamOk={setIsTeamOk} />
      )}
    </div>
  );
};

export default AldimVerdimMain;
