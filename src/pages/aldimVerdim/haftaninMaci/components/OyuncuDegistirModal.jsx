import { useState } from "react";
import {
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useCaptainContext } from "../../../../context/CaptainContext";

const OyuncuDegistirModal = ({ open, onClose, player, team, teamName }) => {
  const { setBlackTeam, setWhiteTeam } = useCaptainContext();

  const [newName, setNewName] = useState("");

  const handleReplace = (oldPlayer, newName) => {
    const newPlayer = {
      ...oldPlayer,
      name: newName,
    };

    const updatedTeam = team.map((p) =>
      p.id === oldPlayer.id ? newPlayer : p
    );

    if (teamName.includes("Siyah")) {
      setBlackTeam(updatedTeam);
    } else {
      setWhiteTeam(updatedTeam);
    }
  };

  const handleSubmit = () => {
    if (!newName.trim()) return;
    handleReplace(player, newName.trim());
    setNewName("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Oyuncuyu Değiştir</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Yeni Oyuncu İsmi"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button onClick={handleSubmit} variant="contained">
          Değiştir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OyuncuDegistirModal;
