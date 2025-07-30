import React, { useState } from "react";
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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import GroupsIcon from "@mui/icons-material/Groups";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useCaptainContext } from "../../../context/CaptainContext";
import { useNavigate } from "react-router-dom";
import { useFoundWeek } from "../../hooks/useFoundWeek";

const LeftPanel = (props) => {
  const {  weekId } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { setUsers, weeks, setWeeks, setIsAdmin, setIsCaptain, resetAll } =
    useCaptainContext();
  const { foundWeek, foundUsers } = useFoundWeek(weekId);

  const navigate = useNavigate();

  const [openMobilePanel, setOpenMobilePanel] = useState(true);



  const handleLeaveRoom = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const localUser = JSON.parse(userStr);

    const updatedUsers = Object.entries(foundUsers)
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
              {foundUsers && Object.keys(foundUsers).length > 0 ? (
                Object.entries(foundUsers).map(([username, userData], i) => {
                  const localUser = JSON.parse(localStorage.getItem("user"));
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
                        
                        sx={{ color: "#374151" }}
                      />
                     
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
