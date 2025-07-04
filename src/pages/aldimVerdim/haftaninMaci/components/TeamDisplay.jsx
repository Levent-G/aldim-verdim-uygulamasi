import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Slide,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useCaptainContext } from "../../../../context/CaptainContext";

const teamStyles = {
  black: {
    title: "Siyah Takım",
    bgColor: "#333333",
    textColor: "#ffffff",
  },
  white: {
    title: "Beyaz Takım",
    bgColor: "#f0f0f0",
    textColor: "#333333",
  },
};

// Transition effect for modal
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const TeamCard = ({ team, color, onChangePlayer }) => {
  const { title, bgColor, textColor } = teamStyles[color];

  if (!team || team.length === 0) {
    return (
      <Box
        sx={{
          backgroundColor: bgColor,
          color: textColor,
          borderRadius: 3,
          boxShadow: 6,
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Comic Sans MS, cursive",
          }}
        >
          Takımlar oluşturulmadı
        </Typography>
      </Box>
    );
  }

  return (
    <Card
      sx={{
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: 3,
        boxShadow: 6,
        width: "100%",
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            fontFamily: "Comic Sans MS, cursive",
            mb: 2,
            textAlign: "center",
          }}
        >
          {title}
        </Typography>

        <Stack spacing={2}>
          {team.map((player) => (
            <Box
              key={player.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                p: 1,
                backgroundColor:
                  color === "black" ? "rgba(255,255,255,0.1)" : "#ffffff",
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={player.avatar || undefined}
                  sx={{
                    bgcolor: color === "black" ? "#555" : "#ccc",
                    color: color === "black" ? "#fff" : "#333",
                    width: 48,
                    height: 48,
                    fontWeight: "bold",
                  }}
                >
                  {player.avatar
                    ? ""
                    : player.name?.charAt(0)?.toUpperCase() || "?"}
                </Avatar>
                <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
                  {player.name.toUpperCase()}
                </Typography>
              </Box>

              <IconButton
                onClick={() => onChangePlayer(color, player)}
                sx={{
                  color: color === "black" ? "#fff" : "#333",
                }}
              >
                <SwapHorizIcon />
              </IconButton>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

const TeamDisplay = () => {
  const { blackDoneTeam, whiteDoneTeam, setBlackDoneTeam, setWhiteDoneTeam } =
    useCaptainContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentTeamColor, setCurrentTeamColor] = useState("");
  const [newPlayerName, setNewPlayerName] = useState("");

  const handleOpenModal = (teamColor, player) => {
    setCurrentPlayer(player);
    setCurrentTeamColor(teamColor);
    setNewPlayerName("");
    setModalOpen(true);
  };

  const handleConfirmChange = () => {
    if (!newPlayerName.trim()) return;

    let updatedTeam = [
      ...(currentTeamColor === "black" ? blackDoneTeam : whiteDoneTeam),
    ];

    updatedTeam = updatedTeam.filter((p) => p.id !== currentPlayer.id);

    updatedTeam.push({
      id: Date.now(),
      name: newPlayerName,
      avatar: "",
    });

    if (currentTeamColor === "black") {
      setBlackDoneTeam(updatedTeam);
    }
    if (currentTeamColor === "white") {
      setWhiteDoneTeam(updatedTeam);
    }

    setModalOpen(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} direction="column">
        <Grid item xs={12}>
          <TeamCard
            team={blackDoneTeam}
            color="black"
            onChangePlayer={handleOpenModal}
          />
        </Grid>
        <Grid item xs={12}>
          <TeamCard
            team={whiteDoneTeam}
            color="white"
            onChangePlayer={handleOpenModal}
          />
        </Grid>
      </Grid>

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            backgroundColor: "#fff",
            color: "#000",
            p: 3,
          },
        }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Comic Sans MS, cursive",
            fontWeight: "bold",
            fontSize: "1.8rem",
            textAlign: "center",
            color: "#000",
          }}
        >
          Oyuncu Değiştir
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Typography
            sx={{
              mb: 2,
              textAlign: "center",
              color: "#333",
            }}
          >
            <strong>{currentPlayer?.name.toUpperCase()}</strong> oyuncusunu değiştirmek
            üzeresiniz.
          </Typography>
          <TextField
            variant="outlined"
            label="Yeni Oyuncu Adı"
            fullWidth
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            sx={{
              backgroundColor: "#f9f9f9",
              borderRadius: 1,
              input: {
                color: "#000",
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => setModalOpen(false)}
            sx={{
              color: "#333",
              borderColor: "#333",
            }}
          >
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmChange}
            sx={{
              backgroundColor: "#000",
              color: "#fff",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
          >
            Onayla
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamDisplay;
