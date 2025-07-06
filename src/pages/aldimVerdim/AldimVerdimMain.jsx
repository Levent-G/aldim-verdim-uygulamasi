import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCaptainContext } from "../../context/CaptainContext";
import PlayerAndCaptainSelection from "./oyuncuSecimi/PlayerAndCaptainSelection";
import TeamSelectionStep from "./takimSecimi/TeamSelectionStep";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import GroupsIcon from "@mui/icons-material/Groups";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const AldimVerdimMain = () => {
  const { weekId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    isTeamOk,
    users,
    setUsers,
    weeks,
    setWeeks,
    isAdmin,
  } = useCaptainContext();

  const findedWeek = weeks.find((w) => w.weekId === Number(weekId));
  const usersSize = findedWeek?.users
    ? Object.keys(findedWeek.users).length
    : 0;
  const odaSize = `${usersSize} / ${findedWeek?.size}`;
  const newUsers = findedWeek?.users;
  const foundWeek = weeks.find((w) => w.weekId === Number(weekId));

  const [openMobilePanel, setOpenMobilePanel] = useState(true);

  const handleLeaveRoom = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const localUser = JSON.parse(userStr);

    const updatedUsers = users.filter((u) => u.nickname !== localUser.nickname);
    setUsers(updatedUsers);

    if (weekId) {
      const currentWeek = weeks.find((w) => w.weekId === Number(weekId));
      if (currentWeek) {
        const updatedWeekUsers = { ...currentWeek.users };
        delete updatedWeekUsers[localUser.nickname];

        const updatedWeek = {
          ...currentWeek,
          users: updatedWeekUsers,
        };

        const newWeeks = weeks.map((w) =>
          w.weekId === Number(weekId) ? updatedWeek : w
        );
        setWeeks(newWeeks);
      }
    }

    localStorage.removeItem("user");
    navigate("/");
  };

  const handleToggleRole = (username, userData) => {

    const newRole = userData.role === "kaptan" ? "user" : "kaptan";

    const updatedWeek = {
      ...foundWeek,
      users: {
        ...foundWeek.users,
        [username]: {
          ...userData,
          role: newRole,
        },
      },
    };

    const newWeeks = weeks.map((w) =>
      w.weekId === Number(weekId) ? updatedWeek : w
    );

    setWeeks(newWeeks);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #f3f4f6, #e5e7eb)",
        color: "#111827",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        overflow: "hidden",
      }}
    >
      {/* Sol Panel */}
      <Box
        sx={{
          width: isMobile ? "100%" : 300,
          bgcolor: "rgba(0,0,0,0.05)",
          backdropFilter: "blur(12px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: isMobile ? "none" : "1px solid rgba(0,0,0,0.1)",
          borderBottom: isMobile ? "1px solid rgba(0,0,0,0.1)" : "none",
          pb: 1,
        }}
      >
        <Collapse
          in={!isMobile || openMobilePanel}
          timeout="auto"
          unmountOnExit
        >
          <Box sx={{ p: 2 }}>
            {/* Oda Bilgisi */}
            <Box>
              <Typography variant="h5" fontWeight="bold" display="flex" gap={1}>
                🎮 Oda Paneli
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "#6b7280", mt: 1 }}>
                Oda Kodu:
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    textDecoration: "underline",
                    mt: 0.5,
                    color: "#374151",
                    fontWeight: "medium",
                  }}
                >
                  {weekId}
                </Typography>
              </Typography>
            </Box>

            {/* Katılımcı Listesi */}
            <Box mt={4} flex={1} overflow="auto">
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                mb={1}
                display="flex"
                alignItems="center"
                gap={1}
              >
                <GroupsIcon /> Katılımcılar {odaSize}
              </Typography>
              <List dense>
                {newUsers && Object.keys(newUsers).length > 0 ? (
                  Object.entries(newUsers).map(([username, userData], i) => (
                    <ListItem
                      key={i}
                      sx={{
                        bgcolor: "rgba(0,0,0,0.05)",
                        mb: 1,
                        borderRadius: 2,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#d1d5db", color: "#374151" }}>
                          {username?.[0]?.toUpperCase() || "?"}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={username || "Anonim"}
                        secondary={
                          userData?.role ? `Rol: ${userData.role}` : ""
                        }
                        sx={{ color: "#374151" }}
                      />
                      {isAdmin && userData.role !== "admin" && (
                        <IconButton
                          size="small"
                          onClick={() => handleToggleRole(username, userData)}
                          sx={{ color: "#374151", ml: "auto" }}
                        >
                          <AdminPanelSettingsIcon fontSize="small" />
                        </IconButton>
                      )}
                    </ListItem>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ color: "#6b7280", fontStyle: "italic" }}
                  >
                    Henüz kimse yok...
                  </Typography>
                )}
              </List>
            </Box>

            {/* Çıkış Butonu */}
            <Box mt={3}>
              <Button
                onClick={handleLeaveRoom}
                variant="contained"
                fullWidth
                startIcon={<ExitToAppIcon />}
                sx={{
                  bgcolor: "#374151",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: 5,
                  "&:hover": {
                    bgcolor: "#1f2937",
                  },
                }}
              >
                Odadan Çık
              </Button>
            </Box>
          </Box>
        </Collapse>

        {/* Toggle İkonu - içerik altında, mobilde görünür */}
        {isMobile && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              py: 1,
              borderTop: "1px solid rgba(0,0,0,0.1)",
              cursor: "pointer",
            }}
          >
            <IconButton
              onClick={() => setOpenMobilePanel(!openMobilePanel)}
              sx={{ color: "#374151" }}
              aria-label={openMobilePanel ? "Paneli kapat" : "Paneli aç"}
              size="large"
            >
              {openMobilePanel ? (
                <KeyboardArrowUpIcon fontSize="inherit" />
              ) : (
                <KeyboardArrowDownIcon fontSize="inherit" />
              )}
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Sağ Panel */}
      <Box
        flex={1}
        width={"100%"}
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={!isMobile && 4}
        mt={isMobile && 5}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            minHeight: "500px",
            borderRadius: 5,
            bgcolor: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(4px)",
            p: isMobile ? 2 : 4,
          }}
        >
          {!isTeamOk ? (
            <PlayerAndCaptainSelection isAdmin={isAdmin} />
          ) : (
            <TeamSelectionStep />
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default AldimVerdimMain;
