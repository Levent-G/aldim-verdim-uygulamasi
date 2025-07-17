import React from "react";
import {
  Box,
  Typography,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Button,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import GroupsIcon from "@mui/icons-material/Groups";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useCaptainContext } from "../../../context/CaptainContext";
import { useNavigate } from "react-router-dom";

const LeftPanel = ({
  isMobile,
  openMobilePanel,
  setOpenMobilePanel,
  users,
  foundWeek,
  setAnchorEl,
  setSelectedUser,
  weekId,
}) => {
  const { setUsers, weeks, setWeeks, setIsAdmin, setIsCaptain,resetAll } =
    useCaptainContext();

  const navigate = useNavigate();

  const handleOpenRoleMenu = (event, username, userData) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser({ username, userData });
  };

  const handleLeaveRoom = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const localUser = JSON.parse(userStr);

    const updatedUsers = Object.entries(users)
      .filter(([key]) => key !== localUser.nickname)
      .reduce((acc, [key, val]) => {
        acc[key] = val;
        return acc;
      }, {});

    const newUpdatedUsers = Object.values(updatedUsers);
    setUsers(newUpdatedUsers);

    if (weekId) {
      const currentWeek = foundWeek;
      if (currentWeek) {
        const updatedWeekUsers = { ...currentWeek.users };
        delete updatedWeekUsers[localUser.nickname];

        const updatedWeek = {
          ...currentWeek,
          users: updatedWeekUsers,
        };

        const newWeeks = weeks.map((w) =>
          w?.weekId === Number(weekId) ? updatedWeek : w
        );

        setWeeks(newWeeks);
      }
    }

    localStorage.removeItem("user");
    setIsAdmin(false);
    setIsCaptain(false);
    navigate("/");
    resetAll();
  };

  const usersSize = foundWeek?.users ? Object.keys(foundWeek.users).length : 0;
  const odaSize = `${usersSize} / ${foundWeek?.size}`;

  return (
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
      <Collapse in={!isMobile || openMobilePanel} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2 }}>
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
              {users && Object.keys(users).length > 0 ? (
                Object.entries(users).map(([username, userData], i) => {
                  const localUser = JSON.parse(localStorage.getItem("user"));
                  const isAdmin = localUser?.isAdmin;
                  const isCurrentUser = localUser?.nickname === username;

                  return (
                    <ListItem
                      key={i}
                      sx={{
                        bgcolor: isCurrentUser ? "#d1fae5" : "rgba(0,0,0,0.05)",
                        mb: 1,
                        borderRadius: 2,
                        border: isCurrentUser ? "2px solid #10b981" : "none",
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: isCurrentUser ? "#10b981" : "#d1d5db",
                            color: isCurrentUser ? "#ffffff" : "#374151",
                          }}
                        >
                          {username?.[0]?.toUpperCase() || "?"}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={username || "Anonim"}
                        secondary={
                          userData?.role === "admin"
                            ? userData?.isCaptain
                              ? `Rol: admin + kaptan (${userData?.rank})`
                              : `Rol: admin`
                            : userData?.role === "kaptan"
                            ? `Rol: kaptan (${userData?.rank})`
                            : `Rol: ${userData?.role}`
                        }
                        sx={{ color: "#374151" }}
                      />
                      {isAdmin && (
                        <IconButton
                          size="small"
                          onClick={(e) =>
                            handleOpenRoleMenu(e, username, userData)
                          }
                          sx={{
                            color: "#374151",
                            ml: "auto",
                          }}
                        >
                          <AdminPanelSettingsIcon fontSize="small" />
                        </IconButton>
                      )}
                    </ListItem>
                  );
                })
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6b7280",
                    fontStyle: "italic",
                  }}
                >
                  Henüz kimse yok...
                </Typography>
              )}
            </List>
          </Box>

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
  );
};

export default LeftPanel;
