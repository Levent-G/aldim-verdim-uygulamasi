import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { useCaptainContext } from "../../context/CaptainContext";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import RoleMenu from "./components/RoleMenu";

const AldimVerdimMain = () => {
  const { weekId } = useParams();
  console.log(weekId)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { weeks } = useCaptainContext();

  const foundWeek = weeks.find((w) => w?.weekId === Number(weekId));
  const isFinished = foundWeek?.isFinished;

  const newUsers = foundWeek?.users || {};

  const [openMobilePanel, setOpenMobilePanel] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

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
      <LeftPanel
        isMobile={isMobile}
        openMobilePanel={openMobilePanel}
        setOpenMobilePanel={setOpenMobilePanel}
        users={newUsers}
        foundWeek={foundWeek}
        setAnchorEl={setAnchorEl}
        setSelectedUser={setSelectedUser}
        weekId={weekId}
      />

      <RightPanel
        isMobile={isMobile}
        users={newUsers}
        isFinished={isFinished}
      />

      <RoleMenu
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
          setSelectedUser(null);
        }}
        selectedUser={selectedUser}
        foundWeek={foundWeek}
        weekId={weekId}
      />
    </Box>
  );
};

export default AldimVerdimMain;
