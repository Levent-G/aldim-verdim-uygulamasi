import React from "react";
import { Typography, useTheme, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import FootballerSVG from "./FootballerSVG";

export default function Captain({
  side,
  name,
  active,
  animatingCaptain,
  position,
  steps,
  isGameOver,
  onClick,
}) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  // Mobilde adım uzunluklarını daha küçük tut
  const mobileSteps = side === "black"
    ? [-80, -60, -40, -30, -20, -10, -5]
    : [80, 60, 40, 30, 20, 10, 5];
  return (
    <motion.div
      key={`captain-${side}`}
      initial={false}
      animate={{
        x: isXs
          ? mobileSteps[position] || mobileSteps[0]
          : steps[position] || steps[0],
      }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
      style={{
        cursor: !isGameOver && active ? "pointer" : "default",
        zIndex: active ? 10 : 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border:
          active && !isGameOver
            ? `3px solid ${side === "black" ? "black" : "white"}`
            : "3px solid transparent",
        borderRadius: 12,
        padding: isXs ? 4 : 8,
        color: side === "white" ? "white" : "black",
        minWidth: isXs ? 56 : 80,
      }}
      whileHover={{
        scale: active && !isGameOver ? 1.1 : 1,
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <FootballerSVG
        active={animatingCaptain === side}
        direction={side === "black" ? "left" : "right"}
        color={side}
        size={isXs ? 48 : 64}
      />
      <Typography
        variant={isXs ? "caption" : "subtitle1"}
        textAlign="center"
        sx={{
          mt: 1,
          maxWidth: 90,
          wordWrap: "break-word",
          color: side === "white" ? "white" : "black",
          fontWeight: "bold",
        }}
      >
        {name.toUpperCase()}
      </Typography>
    </motion.div>
  );
}
