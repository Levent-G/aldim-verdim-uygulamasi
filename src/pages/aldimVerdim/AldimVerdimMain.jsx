import { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import RoleMenu from "./components/RoleMenu";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";

const AldimVerdimMain = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { weekId } = useParams();

  const [openRoleMenu, setOpenRolMenu] = useState(null);
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
        setOpenRolMenu={setOpenRolMenu}
        setSelectedUser={setSelectedUser}
        weekId={weekId}
      />

      <RightPanel weekId={weekId} />

      <RoleMenu
        openRoleMenu={openRoleMenu}
        onClose={() => {
          setOpenRolMenu(null);
          setSelectedUser(null);
        }}
        selectedUser={selectedUser}
        weekId={weekId}
      />
    </Box>
  );
};

export default AldimVerdimMain;
