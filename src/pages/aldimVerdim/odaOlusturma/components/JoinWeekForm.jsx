import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCaptainContext } from "../../../../context/CaptainContext";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useFoundWeek } from "../../../hooks/useFoundWeek";

const JoinWeekForm = () => {
  const { weeks, setWeeks, users, setUsers } = useCaptainContext();
  
  const navigate = useNavigate();
  
  const [nickname, setNickname] = useState("");
  const [weekId, setWeekId] = useState("");
  
  const {foundWeek} = useFoundWeek(weekId);

  const handleJoin = async () => {
    if (!nickname || !weekId) {
      alert("Lütfen kullanıcı adı ve week ID giriniz!");
      return;
    }
    
    if (!foundWeek) {
      alert("Week bulunamadı!");
      return;
    }

    const currentUserCount = foundWeek.users ? Object.keys(foundWeek.users).length : 0;
    if (currentUserCount >= foundWeek.size) {
      alert("Week dolu!");
      return;
    }

    if (foundWeek.users && foundWeek.users[nickname]) {
      alert("Bu kullanıcı adı zaten bu week içinde mevcut!");
      return;
    }

    let isAdmin = false;
    if (currentUserCount === 0 ) {
      isAdmin = true;
    } else {
      isAdmin = false;
    }

    const updatedWeek = {
      ...foundWeek,
      users: {
        ...foundWeek.users,
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
      joinedRoom: foundWeek.weekId,
      role: isAdmin ? "admin" : "user",
      rank: null,
      isCaptain: false,
      isAdmin: isAdmin,
    };

    const updatedUsers = [...(Array.isArray(users) ? users : []), newUser];

    setUsers(updatedUsers);
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
