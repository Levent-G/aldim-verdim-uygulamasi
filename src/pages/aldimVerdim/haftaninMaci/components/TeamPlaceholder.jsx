import { Box, Typography } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";

const TeamPlaceholder = ({ teamName }) => {
  return (
    <Box
      sx={{
        p: 3,
        border: "2px dashed #9ca3af",
        borderRadius: 4,
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
        textAlign: "center",
      }}
    >
      <GroupsIcon sx={{ fontSize: 48, color: "#9ca3af", mb: 1 }} />
      <Typography variant="h6" color="text.secondary" sx={{ fontWeight: "bold" }}>
        {teamName}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Takım henüz oluşturulmadı
      </Typography>
    </Box>
  );
};

export default TeamPlaceholder;
