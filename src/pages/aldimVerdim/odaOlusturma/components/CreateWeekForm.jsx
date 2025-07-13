import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useCaptainContext } from "../../../../context/CaptainContext";
import { useNavigate } from "react-router-dom";

const defaultWeekSizes = [2, 4, 6, 8, 14];

const CreateWeekForm = () => {
  const { weeks, setWeeks, users, setUsers } = useCaptainContext();

  const [nickname, setNickname] = useState("");
  const [weekSize, setWeekSize] = useState(14);
  const [isPrivate, setIsPrivate] = useState(false);

  const navigate = useNavigate();

  const handleCreateWeek = async () => {
    if (!nickname) {
      alert("Lütfen kullanıcı adınızı girin!");
      return;
    }

    const newWeekId = Date.now();

    const newWeek = {
      size: weekSize,
      users: {
        [nickname]: {
          role: "admin",
          rank: null,
          isCaptain: false,
          isAdmin: true,
        },
      },
      isPrivate: isPrivate,
      weekId: newWeekId,
    };

    const newUser = {
      nickname,
      joinedWeek: newWeekId,
      role: "admin",
      rank: null,
      isCaptain: false,
      isAdmin: true,
    };

    setUsers([...users, newUser]);
    setWeeks([...weeks, newWeek]);
    localStorage.setItem("user", JSON.stringify(newUser));

    alert(`Hafta oluşturuldu! Hafta ID: ${newWeekId}`);
    navigate(`/aldim-verdim/${newWeekId}`);

    setNickname("");
    setWeekSize(14);
    setIsPrivate(false);
  };

  return (
    <Box>
      <Typography variant="h6">Hafta Oluştur</Typography>
      <TextField
        label="Kullanıcı Adı"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <TextField
        select
        label="Hafta Oyuncu Kapasitesi"
        value={weekSize}
        onChange={(e) => setWeekSize(Number(e.target.value))}
        fullWidth
        sx={{ mt: 2 }}
      >
        {defaultWeekSizes.map((size) => (
          <MenuItem key={size} value={size}>
            {size} Kişi
          </MenuItem>
        ))}
      </TextField>

      <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              color="primary"
            />
          }
          label={isPrivate ? "Özel Hafta" : "Genel Hafta"}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateWeek}
          sx={{ width: "153px" }}
        >
          Hafta Oluştur
        </Button>
      </Box>
    </Box>
  );
};

export default CreateWeekForm;
