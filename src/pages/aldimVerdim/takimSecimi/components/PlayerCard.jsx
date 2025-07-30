import { motion } from "framer-motion";
import { Card, Box, Avatar, Typography, useTheme, useMediaQuery } from "@mui/material";

export default function PlayerCard({
  player,
  onClick,
  isCaptain,
  variant = "default",
  animating = false,
}) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const avatarBg =
    variant === "black"
      ? "grey.900"
      : variant === "white"
      ? "grey.300"
      : "primary.main";
  const avatarColor =
    variant === "black"
      ? "white"
      : variant === "white"
      ? "black"
      : "white";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.7, y: -20 }}
      layout
    >
      <Card
        onClick={onClick}
        sx={{
          cursor: onClick && !animating ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          p: 1,
          mb: 1,
          bgcolor:
            variant === "black"
              ? "#333"
              : variant === "white"
              ? "#fff"
              : "transparent",
          color: variant === "black" ? "white" : "black",
          justifyContent: "space-between",
          "&:hover":
            onClick && !animating
              ? { bgcolor: "#e3f2fd", boxShadow: 6 }
              : {},
        }}
        elevation={3}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            sx={{
              width: isXs ? 32 : 40,
              height: isXs ? 32 : 40,
              bgcolor: avatarBg,
              color: avatarColor,
              fontWeight: "bold",
            }}
          >
            {getInitials(player.name)}
          </Avatar>
          <Typography variant={isXs ? "body2" : "body1"}>
            {player.name.toUpperCase()}
          </Typography>
        </Box>

        {isCaptain && (
          <Box
            sx={{
              bgcolor: "black",
              color: "white",
              fontWeight: "bold",
              borderRadius: "50%",
              width: 24,
              height: 24,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 14,
              userSelect: "none",
            }}
            title="Kaptan"
          >
            K
          </Box>
        )}
      </Card>
    </motion.div>
  );
}
