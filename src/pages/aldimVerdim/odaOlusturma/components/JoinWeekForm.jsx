import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useCaptainContext } from "../../../../context/CaptainContext";
import { useNavigate } from "react-router-dom";

const JoinWeekForm = () => {
  const { weeks, setWeeks, users, setUsers } = useCaptainContext();

  const [nickname, setNickname] = useState("");
  const [weekId, setWeekId] = useState("");

  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!nickname || !weekId) {
      alert("Lütfen kullanıcı adı ve week ID giriniz!");
      return;
    }

    const week = weeks.find((w) => w?.weekId === Number(weekId));
    if (!week) {
      alert("Week bulunamadı!");
      return;
    }

    const currentUserCount = week.users ? Object.keys(week.users).length : 0;
    if (currentUserCount >= week.size) {
      alert("Week dolu!");
      return;
    }

    if (week.users && week.users[nickname]) {
      alert("Bu kullanıcı adı zaten bu week içinde mevcut!");
      return;
    }

    // *** BOŞSA ADMİN YETKİSİ VER ***
    let isAdmin = false;
    if (currentUserCount === 0 && !week.isFinished) {
      isAdmin = true;
    } else if (week.isFinished) {
      alert(
        "Bu hafta tamamlanmış. Odaya girebilirsiniz ama admin yetkiniz olmayacak!"
      );
      isAdmin = false;
    } else {
      // İstersen başka admin atama logic'i buraya
      isAdmin = false;
    }

    const updatedWeek = {
      ...week,
      users: {
        ...week.users,
        [nickname]: {
          role: isAdmin ? "admin" : "user",
          rank: null,
          isCaptain: false,
          isAdmin: isAdmin,
        },
      },
    };

    const updatedWeeks = weeks.map((w) =>
      w?.weekId === Number(weekId) ? updatedWeek : w
    );
    setWeeks(updatedWeeks);

    const newUser = {
      nickname,
      joinedRoom: week.weekId,
      role: isAdmin ? "admin" : "user",
      rank: null,
      isCaptain: false,
      isAdmin: isAdmin,
    };

    setUsers([...users, newUser]);
    localStorage.setItem("user", JSON.stringify(newUser));

    alert(`Başarıyla ${weekId} week'ine katıldınız.`);
    navigate(`/aldim-verdim/${weekId}`);

    setNickname("");
    setWeekId("");
  };

  return (
    <Box>
      <Typography variant="h6">Haftaya Katıl</Typography>
      <TextField
        label="Kullanıcı Adı"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <TextField
        label="Hafta ID"
        value={weekId}
        onChange={(e) => setWeekId(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 2 }}
        onClick={handleJoin}
      >
        Haftaya Katıl
      </Button>
    </Box>
  );
};

export default JoinWeekForm;
