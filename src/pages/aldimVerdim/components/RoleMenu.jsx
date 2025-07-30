import {
  Menu,
  Divider,
  MenuItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { useFoundWeek } from "../../hooks/useFoundWeek";
import { useCaptainContext } from "../../../context/CaptainContext";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";

const RoleMenu = ({
  openRoleMenu,
  onClose,
  selectedUser,
  weekId,
}) => {
  const {
    weeks,
    setIsAdmin,
    setWeeks,
    setIsCaptain,
    updateUserInWeekAndLocalStorage,
  } = useCaptainContext();

  const { foundWeek } = useFoundWeek(weekId);

  if (!selectedUser) return null;

  const handleChangeRole = (newRole) => {
    const { username, userData } = selectedUser;

    let updatedUserData = { ...userData };

    if (newRole === "kaptan") {
      const captains = Object.entries(foundWeek?.users || {}).filter(
        ([, u]) => u.role === "kaptan" || u.isCaptain
      );

      if (captains.length === 1) {
        const existingCaptainRank = captains[0][1]?.rank;
        updatedUserData.rank =
          existingCaptainRank === "beyaz" ? "siyah" : "beyaz";
      } else {
        updatedUserData.rank = "siyah";
      }

      updatedUserData.isCaptain = true;
      updatedUserData.role = "kaptan";
    } else {
      if (newRole === "user") {
        updatedUserData.role = "user";
        updatedUserData.isCaptain = false;
        updatedUserData.rank = null;
      } else if (newRole === "admin") {
        updatedUserData.role = "admin";
        updatedUserData.isCaptain = false;
        updatedUserData.rank = null;
      }
    }

    const updatedWeek = {
      ...foundWeek,
      users: {
        ...foundWeek.users,
        [username]: updatedUserData,
      },
    };

    const newWeeks = weeks.map((w) =>
      w?.weekId === Number(weekId) ? updatedWeek : w
    );

    setWeeks(newWeeks);

    const localNickname = JSON.parse(localStorage.getItem("user"))?.nickname;

    if (username === localNickname) {
      updateUserInWeekAndLocalStorage(username, updatedUserData);
      if (newRole === "admin") {
        setIsAdmin(true);
      } else if (newRole === "user") {
        setIsAdmin(false);
      }
    }

    onClose();
  };

  const handleChangeRank = (requestedRank) => {
    const { username, userData } = selectedUser;

    const captains = Object.entries(foundWeek.users).filter(
      ([, u]) => u.isCaptain === true
    );

    const updatedUsers = { ...foundWeek.users };

    updatedUsers[username] = {
      ...userData,
      rank: requestedRank,
      isCaptain: true,
      role: "kaptan",
    };

    const otherCaptainEntry = captains.find(
      ([otherUsername]) => otherUsername !== username
    );

    if (otherCaptainEntry) {
      const [otherUsername, otherUserData] = otherCaptainEntry;
      const newOtherRank = requestedRank === "siyah" ? "beyaz" : "siyah";

      updatedUsers[otherUsername] = {
        ...otherUserData,
        rank: newOtherRank,
        isCaptain: true,
        role: "kaptan",
      };
    }

    const updatedWeek = {
      ...foundWeek,
      users: updatedUsers,
    };

    const newWeeks = weeks.map((w) =>
      w?.weekId === Number(weekId) ? updatedWeek : w
    );

    setWeeks(newWeeks);

    const localNickname = JSON.parse(localStorage.getItem("user"))?.nickname;

    if (username === localNickname) {
      updateUserInWeekAndLocalStorage(username, updatedUsers[username]);
      setIsCaptain(true);
    }

    onClose();
  };

  return (
    <Menu
      anchorEl={openRoleMenu}
      open={Boolean(openRoleMenu)}
      onClose={onClose}
    >
      {selectedUser?.userData?.role !== "kaptan" &&
        !selectedUser?.userData?.isCaptain && (
          <MenuItem onClick={() => handleChangeRole("kaptan")}>Kaptan</MenuItem>
        )}

      {selectedUser?.userData?.role !== "user" && (
        <MenuItem onClick={() => handleChangeRole("user")}>User</MenuItem>
      )}

      {selectedUser?.userData?.role !== "admin" && (
        <MenuItem onClick={() => handleChangeRole("admin")}>Admin</MenuItem>
      )}

      {(selectedUser?.userData?.role === "kaptan" ||
        selectedUser?.userData?.isCaptain) && (
        <>
          <Divider />
          <MenuItem
            onClick={() => handleChangeRank("siyah")}
            selected={selectedUser?.userData?.rank === "siyah"}
          >
            <ListItemIcon>
              <SportsSoccerIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Siyah Takım</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => handleChangeRank("beyaz")}
            selected={selectedUser?.userData?.rank === "beyaz"}
          >
            <ListItemIcon>
              <SportsSoccerIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Beyaz Takım</ListItemText>
          </MenuItem>
        </>
      )}
    </Menu>
  );
};

export default RoleMenu;
