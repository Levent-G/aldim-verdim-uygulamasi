import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { database } from "../firebase";
import { ref, onValue, update } from "firebase/database";

const CaptainContext = createContext();
const DB_PATH = "sharedGameState";
const DB_PATH_USERS = DB_PATH + "users";
const DB_PATH_WEEK = DB_PATH + "weeks";

export const CaptainProvider = ({ children }) => {
  const [blackCaptain, setBlackCaptain] = useState(null);
  const [whiteCaptain, setWhiteCaptain] = useState(null);
  const [playerPool, setPlayerPool] = useState([]);
  const [players, setPlayers] = useState([]);
  const [isTeamOk, setIsTeamOk] = useState(false);
  const [blackTeam, setBlackTeam] = useState([]);
  const [whiteTeam, setWhiteTeam] = useState([]);
  const [turn, setTurn] = useState("white");
  const [captainPos, setCaptainPos] = useState({ black: 0, white: 0 });
  const [animatingCaptain, setAnimatingCaptain] = useState(null);
  const [blackDoneTeam, setBlackDoneTeam] = useState([]);
  const [whiteDoneTeam, setWhiteDoneTeam] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCaptain, setIsCaptain] = useState(false);

  const [weekId, setWeekId] = useState(null);

  const DB_PATH_WEEK_ITEM = `${DB_PATH}/weeks/${weekId}`;

  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (!weekId) return;

    const nickName = JSON.parse(localStorage.getItem("user"))?.nickname;
    if (!nickName) {
      setIsAdmin(false);
      setIsCaptain(false);
      return;
    }

    const currentWeek = weeks.find((w) => w.weekId === Number(weekId));
    if (!currentWeek?.users) {
      setIsAdmin(false);
      setIsCaptain(false);
      return;
    }

    const userRole = currentWeek.users[nickName]?.role;
    setIsAdmin(userRole === "admin");
    setIsCaptain(userRole === "kaptan");
  }, [weeks, weekId]);

  useEffect(() => {
    const dbRef = ref(database, DB_PATH_WEEK_ITEM);
    const unsubscribeWeekItem = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBlackCaptain(data.blackCaptain || null);
        setWhiteCaptain(data.whiteCaptain || null);
        setPlayerPool(data.playerPool || []);
        setPlayers(data.players || []);
        setBlackTeam(data.blackTeam || []);
        setWhiteTeam(data.whiteTeam || []);
        setIsTeamOk(data.isTeamOk || false);
        setTurn(data.turn || "white");
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
        setTurn("white");
        setCaptainPos({ black: 0, white: 0 });
        setAnimatingCaptain(null);
        setBlackDoneTeam([]);
        setWhiteDoneTeam([]);
      }
      isInitialLoad.current = false;
    });

    const userDbRef = ref(database, DB_PATH_USERS);
    const unsubscribeUsers = onValue(userDbRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        setUsers(userData.users || []);
      } else {
        setUsers([]);
      }
    });

    const weekDbRef = ref(database, DB_PATH_WEEK);
    const unsubscribeWeek = onValue(weekDbRef, (snapshot) => {
      const weekData = snapshot.val();
      if (weekData) {
        setIsAdmin(weekData.isAdmin || false);
        setIsCaptain(weekData.isCaptain || false);
        setWeeks(weekData.week || []);
      } else {
        setWeeks([]);
      }
    });

    return () => {
      unsubscribeWeekItem();
      unsubscribeUsers();
      unsubscribeWeek();
    };
  }, [DB_PATH_WEEK_ITEM]);

  const getWeekId = useCallback((weekId) => {
    setWeekId(weekId);
  }, []);

  // Helper: Firebase update
  const updateFirebaseWeekItem = (updates) => {
    const dbRef = ref(database, DB_PATH_WEEK_ITEM);
    update(dbRef, updates).catch((e) =>
      console.error("Firebase update error:", e)
    );
  };

  const updateFireBaseUsers = (updates) => {
    const userDbRef = ref(database, DB_PATH_USERS);
    update(userDbRef, updates).catch((e) =>
      console.error("Firebase users update error:", e)
    );
  };

  const updateFireBaseWeek = (updates) => {
    const weekDbRef = ref(database, DB_PATH_WEEK);
    update(weekDbRef, updates).catch((e) =>
      console.error("Firebase week update error:", e)
    );
  };

  // Wrapped setters to sync state and Firebase
  const setBlackCaptainAndSync = (value) => {
    setBlackCaptain(value);
    updateFirebaseWeekItem({ blackCaptain: value });
  };

  const setWhiteCaptainAndSync = (value) => {
    setWhiteCaptain(value);
    updateFirebaseWeekItem({ whiteCaptain: value });
  };

  const setPlayerPoolAndSync = (value) => {
    setPlayerPool(value);
    updateFirebaseWeekItem({ playerPool: value });
  };

  const setPlayersAndSync = (value) => {
    setPlayers(value);
    updateFirebaseWeekItem({ players: value });
  };

  const setIsTeamOkAndSync = (value) => {
    setIsTeamOk(value);
    updateFirebaseWeekItem({ isTeamOk: value });
  };

  const setBlackTeamAndSync = (value) => {
    setBlackTeam(value);
    updateFirebaseWeekItem({ blackTeam: value });
  };

  const setWhiteTeamAndSync = (value) => {
    setWhiteTeam(value);
    updateFirebaseWeekItem({ whiteTeam: value });
  };

  const setTurnAndSync = (value) => {
    setTurn(value);
    updateFirebaseWeekItem({ turn: value });
  };

  const setCaptainPosAndSync = (value) => {
    setCaptainPos(value);
    updateFirebaseWeekItem({ captainPos: value });
  };

  const setAnimatingCaptainAndSync = (value) => {
    setAnimatingCaptain(value);
    updateFirebaseWeekItem({ animatingCaptain: value });
  };

  const setBlackDoneTeamAndSync = (value) => {
    setBlackDoneTeam(value);
    updateFirebaseWeekItem({ blackDoneTeam: value });
  };

  const setWhiteDoneTeamAndSync = (value) => {
    setWhiteDoneTeam(value);
    updateFirebaseWeekItem({ whiteDoneTeam: value });
  };

  const setWeeksAndSync = (value) => {
    setWeeks(value);
    updateFireBaseWeek({ week: value });
  };

  const setUsersAndSync = (value) => {
    setUsers(value);
    updateFireBaseUsers({ users: value });
  };

  // Reset captains but keep players
  const clearCaptains = () => {
    setBlackCaptain(null);
    setWhiteCaptain(null);
    setPlayerPool(players);
    setIsTeamOk(false);
    updateFirebaseWeekItem({
      blackCaptain: null,
      whiteCaptain: null,
      playerPool: players,
      isTeamOk: false,
    });
  };

  // Reset all (except players and teams remain as-is)
  const resetAll = () => {
    setBlackCaptain(null);
    setWhiteCaptain(null);
    setPlayerPool([]);
    setIsTeamOk(false);
    setTurn(null);
    setCaptainPos({ black: 0, white: 0 });
    setAnimatingCaptain(null);
    updateFirebaseWeekItem({
      blackCaptain: null,
      whiteCaptain: null,
      playerPool: [],
      isTeamOk: false,
      turn: null,
      captainPos: { black: 0, white: 0 },
      animatingCaptain: null,
    });
  };

  // Delete all data
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
    setBlackDoneTeam([]);
    setWhiteDoneTeam([]);
    setWeeks([]);
    setUsers([]);
    updateFirebaseWeekItem({
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
      blackDoneTeam: [],
      whiteDoneTeam: [],
      week: [],
      users: [],
    });
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
        deleteAll,
        turn,
        setTurn: setTurnAndSync,
        captainPos,
        setCaptainPos: setCaptainPosAndSync,
        animatingCaptain,
        setAnimatingCaptain: setAnimatingCaptainAndSync,
        blackDoneTeam,
        setBlackDoneTeam: setBlackDoneTeamAndSync,
        whiteDoneTeam,
        setWhiteDoneTeam: setWhiteDoneTeamAndSync,
        weeks,
        setWeeks: setWeeksAndSync,
        users,
        setUsers: setUsersAndSync,
        getWeekId: getWeekId,
        isAdmin,
        isCaptain,
      }}
    >
      {children}
    </CaptainContext.Provider>
  );
};

export const useCaptainContext = () => useContext(CaptainContext);
