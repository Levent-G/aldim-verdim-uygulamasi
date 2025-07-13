import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  IconButton,
  Popover,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import { useCaptainContext } from "../../../../context/CaptainContext";

const UsersInWeek = ({ weekId }) => {
  const { weeks } = useCaptainContext();
  const [anchorEl, setAnchorEl] = useState(null);

  const week = weeks.find((w) => w?.weekId === weekId);
  const userList = week?.users ? Object.keys(week.users) : [];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "users-popover" : undefined;

  return (
    <>
      {/* Sağ alt köşedeki buton */}
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1300,
        }}
      >
        <IconButton
          color="primary"
          aria-describedby={id}
          onClick={handleClick}
          size="large"
        >
          <GroupIcon fontSize="inherit" />
        </IconButton>
      </Box>

      {/* Popover */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        PaperProps={{
          sx: { p: 2, width: 250 },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Week: {weekId}
        </Typography>

        {!week ? (
          <Typography color="error">Week bulunamadı.</Typography>
        ) : userList.length === 0 ? (
          <Typography>Henüz katılımcı yok.</Typography>
        ) : (
          <List dense>
            {userList.map((user) => (
              <ListItem key={user} sx={{ py: 0.5 }}>
                <Typography>{user}</Typography>
              </ListItem>
            ))}
          </List>
        )}
      </Popover>
    </>
  );
};

export default UsersInWeek;
