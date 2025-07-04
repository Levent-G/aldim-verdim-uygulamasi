import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useTheme, useMediaQuery } from "@mui/material";

const FootballerSVG = ({ active, direction = "right", color }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const width = isXs ? 100 : 160;
  const height = isXs ? 90 : 140;

  const skinColor = "#FDD7AA";
  const shirtColor = color || "#1976d2";

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      rotateY: direction === "left" ? 0 : 180,
      transition: { duration: 0.3 },
    });
  }, [active, direction, controls]);

  const legAnimation = {
    active: {
      rotate: [20, -20, 20],
      transition: {
        duration: 1,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
      },
    },
    inactive: { rotate: 0 },
  };

  const headAnimation = {
    active: {
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
    inactive: { rotate: 0 },
  };

  const bodyAnimation = {
    active: {
      y: [0, -5, 0, -5, 0],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
    inactive: { y: 0 },
  };

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        cursor: "pointer",
        userSelect: "none",
        transform: direction === "right" ? "scaleX(-1)" : "scaleX(1)",
      }}
      initial="inactive"
      animate={active ? "active" : "inactive"}
    >
      <motion.g
        transform={`rotate(${direction === "left" ? 0 : 180}, 80, 70)`}
        initial="inactive"
        animate={active ? "active" : "inactive"}
        variants={bodyAnimation}
      >
        {/* Gövde */}
        <rect
          x="60"
          y="50"
          width="40"
          height="60"
          fill={shirtColor}
          rx="12"
          stroke="#222"
          strokeWidth="1.5"
        />
        {/* Kol sağ */}
        <rect
          x="105"
          y="50"
          width="12"
          height="50"
          fill={shirtColor}
          rx="8"
          stroke="#222"
          strokeWidth="1.5"
        />
        {/* Kol sol */}
        <rect
          x="43"
          y="50"
          width="12"
          height="50"
          fill={shirtColor}
          rx="8"
          stroke="#222"
          strokeWidth="1.5"
        />
      </motion.g>

      {/* Kafa */}
      <motion.circle
        cx="80"
        cy="30"
        r="20"
        fill={skinColor}
        stroke="#222"
        strokeWidth="1.5"
        transform={`rotate(${direction === "left" ? 0 : 180}, 80, 30)`}
        initial="inactive"
        animate={active ? "active" : "inactive"}
        variants={headAnimation}
      />

      {/* Gözler */}
      <circle
        cx={direction === "left" ? 65 : 95}
        cy="27"
        r="4"
        fill="#333"
        style={{ filter: "drop-shadow(0 0 1px #222)" }}
      />
      <circle
        cx={direction === "left" ? 95 : 65}
        cy="27"
        r="4"
        fill="#333"
        style={{ filter: "drop-shadow(0 0 1px #222)" }}
      />

      {/* Ağız */}
      <path
        d="M65 38 Q80 50 95 38"
        stroke="#333"
        strokeWidth="2"
        fill="transparent"
        strokeLinecap="round"
      />

      {/* Sol Bacak */}
      <motion.rect
        x="55"
        y="110"
        width="15"
        height="25"
        fill={shirtColor}
        rx="7"
        stroke="#222"
        strokeWidth="1.5"
        variants={legAnimation}
        initial="inactive"
        animate={active ? "active" : "inactive"}
        style={{ originX: "0%", originY: "50%" }}
      />

      {/* Sağ Bacak */}
      <motion.rect
        x="90"
        y="110"
        width="15"
        height="25"
        fill={shirtColor}
        rx="7"
        stroke="#222"
        strokeWidth="1.5"
        variants={legAnimation}
        initial="inactive"
        animate={active ? "active" : "inactive"}
        style={{ originX: "100%", originY: "50%" }}
      />
    </motion.svg>
  );
};

export default FootballerSVG;
