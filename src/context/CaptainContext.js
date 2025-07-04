import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { database } from "../firebase";
import { ref, onValue, update, set } from "firebase/database";

const CaptainContext = createContext();

const DB_PATH = "sharedGameState";

export const CaptainProvider = ({ children }) => {
  const [blackCaptain, setBlackCaptain] = useState(null);
  const [whiteCaptain, setWhiteCaptain] = useState(null);
  const [playerPool, setPlayerPool] = useState([]);
  const [players, setPlayers] = useState([]);
  const [isTeamOk, setIsTeamOk] = useState(false);
  const [blackTeam, setBlackTeam] = useState([]);
  const [whiteTeam, setWhiteTeam] = useState([]);
  const [turn, setTurn] = useState(null);
  const [captainPos, setCaptainPos] = useState({ black: 0, white: 0 });
  const [animatingCaptain, setAnimatingCaptain] = useState(null);
  const [blackDoneTeam, setBlackDoneTeam] = useState([]);
  const [whiteDoneTeam, setWhiteDoneTeam] = useState([]);

  // İlk veri yüklemesini işaretlemek için ref
  const isInitialLoad = useRef(true);

  // Firebase realtime listener
  useEffect(() => {
    const dbRef = ref(database, DB_PATH);
    return onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data, "aaa");

      if (data) {
        setBlackCaptain(data.blackCaptain || null);
        setWhiteCaptain(data.whiteCaptain || null);
        setPlayerPool(data.playerPool || []);
        setPlayers(data.players || []);
        setBlackTeam(data.blackTeam || []);
        setWhiteTeam(data.whiteTeam || []);
        setIsTeamOk(data.isTeamOk || false);
        setTurn(data.turn || null);
        setCaptainPos(data.captainPos || { black: 0, white: 0 });
        setAnimatingCaptain(data.animatingCaptain || null);
        setBlackDoneTeam(data.blackDoneTeam || []);
        setWhiteDoneTeam(data.whiteDoneTeam || []);
      } else {
        setBlackCaptain(null);
        setWhiteCaptain(null);
        setPlayerPool([]);
        setPlayers([]);
        setBlackTeam([]);
        setWhiteTeam([]);
        setIsTeamOk(false);
        setTurn(null);
        setCaptainPos({ black: 0, white: 0 });
        setAnimatingCaptain(null);
        setBlackDoneTeam([]);
        setWhiteDoneTeam([]);
      }
      isInitialLoad.current = false;
    });
  }, []);

  // Firebase update helper
  const updateFirebase = (updates) => {
    const dbRef = ref(database, DB_PATH);
    update(dbRef, updates).catch((e) =>
      console.error("Firebase update error:", e)
    );
  };

  // Wrap state setters to sync Firebase

  const setBlackCaptainAndSync = (value) => {
    setBlackCaptain(value);
    updateFirebase({ blackCaptain: value });
  };

  const setWhiteCaptainAndSync = (value) => {
    setWhiteCaptain(value);
    updateFirebase({ whiteCaptain: value });
  };

  const setPlayerPoolAndSync = (value) => {
    setPlayerPool(value);
    updateFirebase({ playerPool: value });
  };

  const setPlayersAndSync = (value) => {
    setPlayers(value);
    updateFirebase({ players: value });
  };

  const setIsTeamOkAndSync = (value) => {
    setIsTeamOk(value);
    updateFirebase({ isTeamOk: value });
  };

  const setBlackTeamAndSync = (value) => {
    setBlackTeam(value);
    updateFirebase({ blackTeam: value });
  };

  const setWhiteTeamAndSync = (value) => {
    setWhiteTeam(value);
    updateFirebase({ whiteTeam: value });
  };

  // Captains sıfırlama (oyuncuları koru)
  const clearCaptains = () => {
    setBlackCaptain(null);
    setWhiteCaptain(null);
    setPlayerPool(players);
    setIsTeamOk(false);
    updateFirebase({
      blackCaptain: null,
      whiteCaptain: null,
      playerPool: players,
      isTeamOk: false,
    });
  };

  // Tam reset - tüm state sıfırla
  const resetAll = () => {
    setBlackCaptain(null);
    setWhiteCaptain(null);
    setPlayerPool([]);
    setPlayers(players);
    setBlackTeam(blackTeam);
    setWhiteTeam(whiteTeam);
    setIsTeamOk(false);
    setTurn(null);
    setCaptainPos({ black: 0, white: 0 });
    setAnimatingCaptain(null);
    updateFirebase({
      blackCaptain: null,
      whiteCaptain: null,
      playerPool: [],
      players: players,
      blackTeam: blackTeam,
      whiteTeam: whiteTeam,
      isTeamOk: false,
      turn: null,
      captainPos: { black: 0, white: 0 },
      animatingCaptain: null,
    });
  };

  const deleteAll = () => {
    setBlackCaptain(null);
    setWhiteCaptain(null);
    setPlayerPool([]);
    setPlayers([]);
    setBlackTeam([]);
    setWhiteTeam([]);
    setIsTeamOk(false);
    setTurn(null);
    setCaptainPos({ black: 0, white: 0 });
    setAnimatingCaptain(null);
    updateFirebase({
      blackCaptain: null,
      whiteCaptain: null,
      playerPool: [],
      players: [],
      blackTeam: [],
      whiteTeam: [],
      isTeamOk: false,
      turn: null,
      captainPos: { black: 0, white: 0 },
      animatingCaptain: null,
    });
  };

  const setTurnAndSync = (value) => {
    setTurn(value);
    updateFirebase({ turn: value });
  };

  const setCaptainPosAndSync = (value) => {
    setCaptainPos(value);
    updateFirebase({ captainPos: value });
  };

  const setAnimatingCaptainAndSync = (value) => {
    setAnimatingCaptain(value);
    updateFirebase({ animatingCaptain: value });
  };

  const setBlackDoneTeamAndSync = (value) => {
    setBlackDoneTeam(value);
    updateFirebase({ blackDoneTeam: value });
  };

  const setWhiteDoneTeamAndSync = (value) => {
    setWhiteDoneTeam(value);
    updateFirebase({ whiteDoneTeam: value });
  };

  return (
    <CaptainContext.Provider
      value={{
        blackCaptain,
        setBlackCaptain: setBlackCaptainAndSync,
        whiteCaptain,
        setWhiteCaptain: setWhiteCaptainAndSync,
        playerPool,
        setPlayerPool: setPlayerPoolAndSync,
        players,
        setPlayers: setPlayersAndSync,
        blackTeam,
        setBlackTeam: setBlackTeamAndSync,
        whiteTeam,
        setWhiteTeam: setWhiteTeamAndSync,
        isTeamOk,
        setIsTeamOk: setIsTeamOkAndSync,
        clearCaptains,
        resetAll,
        turn,
        setTurn: setTurnAndSync,
        captainPos,
        setCaptainPos: setCaptainPosAndSync,
        animatingCaptain,
        setAnimatingCaptain: setAnimatingCaptainAndSync,
        deleteAll: deleteAll,
        blackDoneTeam,
        setBlackDoneTeam: setBlackDoneTeamAndSync,
        whiteDoneTeam,
        setWhiteDoneTeam: setWhiteDoneTeamAndSync,
      }}
    >
      {children}
    </CaptainContext.Provider>
  );
};

export const useCaptainContext = () => useContext(CaptainContext);
