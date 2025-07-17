import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useCaptainContext } from "../../../context/CaptainContext";
import Header from "./components/Header";
import InputControls from "./components/InputControls";
import PlayerList from "./components/PlayerList";
import ActionButtons from "./components/ActionButtons";
import WeekMatch from "../haftaninMaci/WeekMatch";

export default function PlayerAndCaptainSelection({
  isAdmin,
  users,
  isFinished,
}) {
  const {
    players,
    setPlayers,
    blackCaptain,
    setBlackCaptain,
    whiteCaptain,
    setWhiteCaptain,
    setPlayerPool,
    clearCaptains,
    setIsTeamOk,
    deleteAll,
    getWeekId,
  } = useCaptainContext();

  const user = JSON.parse(localStorage.getItem("user"));
  const { weekId } = useParams();

  const selectedCaptains = [blackCaptain, whiteCaptain].filter(Boolean);
  const [name, setName] = useState("");

  useEffect(() => {
    if (weekId) {
      getWeekId(weekId);
    }
  }, [weekId, getWeekId]);

  const addPlayer = () => {
    if (user.isAdmin) {
      const trimmed = name.trim();
      if (!trimmed) return;
      setPlayers([...players, { id: Date.now(), name: trimmed, avatar: "" }]);
      setName("");
    }
  };

  const toggleCaptainSelect = (player) => {
    if (user.isAdmin) {
      const isAlreadySelected =
        blackCaptain?.id === player.id || whiteCaptain?.id === player.id;

      if (isAlreadySelected) {
        if (blackCaptain?.id === player.id) setBlackCaptain(null);
        else if (whiteCaptain?.id === player.id) setWhiteCaptain(null);
      } else {
        if (!blackCaptain) {
          setBlackCaptain(player);
        } else if (!whiteCaptain) {
          setWhiteCaptain(player);
        }
      }
    }
  };

  const handleRandomCaptain = () => {
    if (user.isAdmin) {
      if (players.length < 2) {
        alert("En az 2 oyuncu olmalı.");
        return;
      }
      let firstIndex = Math.floor(Math.random() * players.length);
      let secondIndex;
      do {
        secondIndex = Math.floor(Math.random() * players.length);
      } while (secondIndex === firstIndex);

      const rand1 = players[firstIndex];
      const rand2 = players[secondIndex];

      const poolCopy = players.filter(
        (p) => p.id !== rand1.id && p.id !== rand2.id
      );

      setBlackCaptain(rand1);
      setWhiteCaptain(rand2);
      setPlayerPool(poolCopy);
    }
  };

  const handleStartTeam = () => {
    if (user.isAdmin) {
      if (!blackCaptain || !whiteCaptain) {
        alert("Lütfen 2 kaptan seçin ya da rastgele seçin.");
        return;
      }
      const poolCopy = players.filter(
        (p) => p.id !== blackCaptain?.id && p.id !== whiteCaptain?.id
      );
      setPlayerPool(poolCopy);
      setIsTeamOk(true);
    }
  };

  const handleDeletePlayer = (playerId) => {
    if (user.isAdmin) {
      const filterPlayer = players.filter((p) => p.id !== playerId);
      setPlayers(filterPlayer);
      if (blackCaptain?.id === playerId) setBlackCaptain(null);
      if (whiteCaptain?.id === playerId) setWhiteCaptain(null);
    }
  };

  const handleAddAllUsers = () => {
    if (!users) return;
    const usernames = Object.keys(users);
    const newPlayers = usernames.map((username) => ({
      id: Date.now() + Math.random(),
      name: username,
      avatar: "",
    }));
    const namesAlreadyAdded = players.map((p) => p.name);
    const filteredNewPlayers = newPlayers.filter(
      (p) => !namesAlreadyAdded.includes(p.name)
    );
    setPlayers([...players, ...filteredNewPlayers]);
  };

  const handleClearAllPlayers = () => {
    if (isAdmin) {
      if (
        !window.confirm("Tüm oyuncular ve kaptanlar silinecek. Emin misiniz?")
      )
        return;
      deleteAll();
    }
  };
console.log(isFinished)
  return (
    <Box>
      {!isFinished && (
        <>
          <Header />

          <InputControls
            name={name}
            setName={setName}
            addPlayer={addPlayer}
            handleAddAllUsers={handleAddAllUsers}
            isDisabled={user?.isAdmin === false || selectedCaptains.length > 1}
          />

          <PlayerList
            players={players}
            blackCaptain={blackCaptain}
            whiteCaptain={whiteCaptain}
            selectedCaptains={selectedCaptains}
            toggleCaptainSelect={toggleCaptainSelect}
            handleDeletePlayer={handleDeletePlayer}
            isDisabled={user?.isAdmin === false || selectedCaptains.length > 1}
          />

          <ActionButtons
            handleRandomCaptain={handleRandomCaptain}
            handleStartTeam={handleStartTeam}
            clearCaptains={clearCaptains}
            handleClearAllPlayers={handleClearAllPlayers}
            user={user}
            selectedCaptains={selectedCaptains}
            players={players}
          />
        </>
      )}

      <WeekMatch />
    </Box>
  );
}
