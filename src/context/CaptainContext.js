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
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;

        const user = JSON.parse(userStr);
        const nickname = user.nickname;
        if (!nickname || !weekId) return;

        update(ref(database), {
          [`weeks/${weekId}/users/${nickname}`]: null,
        }).catch(console.error);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [weekId]);
  /**
   * LocalStorage Güncelleme Fonksiyonu
   */
  const updateLocalStorageUser = (username, updatedUserData) => {
    const currentUserStr = localStorage.getItem("user");
    if (!currentUserStr) return;

    const currentUser = JSON.parse(currentUserStr);
    if (currentUser.nickname !== username) return;

    // Mevcut admin/captain durumu korunsun, sadece gerektiğinde override edilsin
    const newUserData = {
      ...currentUser,
      ...updatedUserData,
      isAdmin:
        updatedUserData.role === "admin"
          ? true
          : updatedUserData.role === "user"
          ? false
          : currentUser.isAdmin, // adminlik sadece user yapılınca gider
      isCaptain:
        updatedUserData.role === "kaptan" || updatedUserData.isCaptain === true
          ? true
          : updatedUserData.role === "user"
          ? false
          : currentUser.isCaptain,
    };

    localStorage.setItem("user", JSON.stringify(newUserData));
  };

  /**
   * WeekId değişince kullanıcının isAdmin / isCaptain durumunu güncelle
   */
  useEffect(() => {
    if (!weekId) return;

    const localUserStr = localStorage.getItem("user");
    if (!localUserStr) return;

    const localUser = JSON.parse(localUserStr);
    const currentWeek = weeks.find((w) => w?.weekId === Number(weekId));
    if (!currentWeek) return;

    const latestUserData = currentWeek.users?.[localUser.nickname];
    if (!latestUserData) return;

    updateLocalStorageUser(localUser.nickname, latestUserData);
    setIsAdmin(latestUserData.role === "admin");
    setIsCaptain(
      latestUserData.role === "kaptan" || latestUserData.isCaptain === true
    );
  }, [weeks, weekId]);

  /**
   * Firebase dinleyicileri
   */
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
        setTurn(data.turn || "beyaz");
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
        setTurn("beyaz");
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

  /**
   * Firebase update helpers
   */
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

  /**
   * LocalStorage güncellemesiyle birlikte Week güncelle
   */
  const setWeeksAndSync = (value) => {
    // undefined veya null haftaları sil
    const filtered = value.filter(Boolean);

    setWeeks(filtered);
    updateFireBaseWeek({ week: filtered });

    const localNickname = JSON.parse(localStorage.getItem("user"))?.nickname;
    if (!localNickname) return;

    const currentWeek = filtered.find((w) => w?.weekId === Number(weekId));
    if (!currentWeek || !currentWeek.users) return;

    const userData = currentWeek.users[localNickname];
    if (userData) {
      updateLocalStorageUser(localNickname, userData);
    }
  };

  /**
   * Tek bir user'ı weeks içinde güncelle ve localStorage'a yansıt
   */
  const updateUserInWeekAndLocalStorage = (username, updatedUserData) => {
    const currentWeek = weeks.find((w) => w?.weekId === Number(weekId));
    if (!currentWeek) return;

    const updatedWeek = {
      ...currentWeek,
      users: {
        ...currentWeek.users,
        [username]: updatedUserData,
      },
    };

    const newWeeks = weeks.map((w) =>
      w?.weekId === Number(weekId) ? updatedWeek : w
    );

    setWeeksAndSync(newWeeks);
  };

  /**
   * Diğer wrapped setters
   */
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

  const setUsersAndSync = (value) => {
    setUsers(value);
    updateFireBaseUsers({ users: value });
  };

  const setIsAdminAndSync = (value) => {
    setIsAdmin(value);
    updateFireBaseWeek({ isAdmin: value });
  };

  const setIsCaptainAndSync = (value) => {
    setIsCaptain(value);
    updateFireBaseWeek({ isCaptain: value });
  };

  /**
   * Reset helpers
   */
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
        setIsAdmin: setIsAdminAndSync,
        isCaptain,
        setIsCaptain: setIsCaptainAndSync,
        updateUserInWeekAndLocalStorage,
        weekId,
        updateFireBaseWeek
      }}
    >
      {children}
    </CaptainContext.Provider>
  );
};

export const useCaptainContext = () => useContext(CaptainContext);
