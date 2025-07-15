import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const OyuncuDegistirModal = ({ open, onClose, player, onReplace }) => {
  const [newName, setNewName] = useState("");

  const handleSubmit = () => {
    if (!newName.trim()) return;
    onReplace(player, newName.trim());
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