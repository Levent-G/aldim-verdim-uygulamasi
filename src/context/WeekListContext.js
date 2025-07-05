import React, { createContext, useContext, useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, onValue, push, set, update, remove } from "firebase/database";

const WeekListContext = createContext();

export const WeekListProvider = ({ children }) => {
  const [weeks, setWeeks] = useState([]);
  const [users, setUsers] = useState([]);

  const WEEKS_PATH = "sharedGameState/weeks";
  const USERS_PATH = "sharedGameState/users";

  // Haftaları dinle
  useEffect(() => {
    const weeksRef = ref(database, WEEKS_PATH);
    const unsub = onValue(weeksRef, (snapshot) => {
      const data = snapshot.val() || {};
      // Objeyi diziye çeviriyoruz
      setWeeks(Object.values(data));
    });
    return () => unsub();
  }, []);
  // Kullanıcıları dinle
  useEffect(() => {
    const usersRef = ref(database, USERS_PATH);
    const unsub = onValue(usersRef, (snapshot) => {
      const data = snapshot.val() || {};
      setUsers(Object.values(data));
    });
    return () => unsub();
  }, []);

  // Yeni hafta ekle
  const addWeek = async (newWeek) => {
    const weeksRef = ref(database, WEEKS_PATH);
    const newWeekRef = push(weeksRef);
    await set(newWeekRef, newWeek);
  };

  // Haftayı güncelle (örneğin users objesi)
  const updateWeek = async (weekId, updates) => {
    // weekId aslında push ile oluşturulduğunda key olur, o yüzden şu şekilde güncelle:
    const weeksRef = ref(database, WEEKS_PATH);
    const snapshot = await new Promise((res) => {
      onValue(weeksRef, (snap) => res(snap), { onlyOnce: true });
    });
    const data = snapshot.val() || {};
    // weekId aslında buradaki key olmayabilir, çünkü push ile key oluşturulur, o yüzden önce key'i bul
    const key = Object.keys(data).find(
      (k) => data[k].weekId === weekId
    );
    if (!key) throw new Error("Week bulunamadı");

    const weekRef = ref(database, `${WEEKS_PATH}/${key}`);
    await update(weekRef, updates);
  };

  // Kullanıcı güncelle
  const updateUser = async (nickname, updates) => {
    const userRef = ref(database, `${USERS_PATH}/${nickname}`);
    await update(userRef, updates);
  };

  // Kullanıcı sil
  const deleteUser = async (nickname) => {
    const userRef = ref(database, `${USERS_PATH}/${nickname}`);
    await remove(userRef);
  };

  // Kullanıcıyı haftanın users objesine ekle
  const addUserToWeek = async (weekId, nickname, userData) => {
    // Önce haftanın key'ini bul
    const weeksRef = ref(database, WEEKS_PATH);
    const snapshot = await new Promise((res) => {
      onValue(weeksRef, (snap) => res(snap), { onlyOnce: true });
    });
    const data = snapshot.val() || {};
    const key = Object.keys(data).find(
      (k) => data[k].weekId === weekId
    );
    if (!key) throw new Error("Week bulunamadı");

    const weekUsersRef = ref(database, `${WEEKS_PATH}/${key}/users/${nickname}`);
    await set(weekUsersRef, userData);
  };

  // Genel kullanıcı listesine kullanıcı ekle
  const addUserToGlobal = async (nickname, userData) => {
    const userRef = ref(database, `${USERS_PATH}/${nickname}`);
    await set(userRef, userData);
  };

  const addUser = async (newUser) => {
    const usersRef = ref(database, USERS_PATH);
    const newUserRef = push(usersRef);
    await set(newUserRef, newUser);
  };

  return (
    <WeekListContext.Provider
      value={{
        weeks,
        users,
        addWeek,
        updateWeek,
        deleteUser,
        updateUser,
        addUserToWeek,
        addUserToGlobal,
        addUser
      }}
    >
      {children}
    </WeekListContext.Provider>
  );
};

export const useWeekListContext = () => useContext(WeekListContext);
