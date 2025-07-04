import React, { useState } from "react";
import { useCaptainContext } from "../../../context/CaptainContext";
import TeamDisplay from "./components/TeamDisplay";

const WeekMatch = () => {
  const { blackDoneTeam, whiteDoneTeam } = useCaptainContext();
  const [showTeams, setShowTeams] = useState(false);

  const handleClick = () => {
    console.log("blackDoneTeam", blackDoneTeam, "whiteDoneTeam", whiteDoneTeam);
    setShowTeams(!showTeams);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <button
        onClick={handleClick}
        style={{
          background: "linear-gradient(135deg, #FF416C, #FF4B2B)",
          color: "#fff",
          border: "none",
          borderRadius: "50px",
          padding: "15px 30px",
          fontSize: "18px",
          cursor: "pointer",
          width: "100%",
          fontWeight: "bold",
          letterSpacing: "1px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          transition: "all 0.3s ease",
        }}
      >
        Haftanın maçı kadroları
      </button>

      {showTeams && (
        <div style={{ marginTop: "2rem" }}>
          <TeamDisplay
        
          />
        </div>
      )}
    </div>
  );
};

export default WeekMatch;
