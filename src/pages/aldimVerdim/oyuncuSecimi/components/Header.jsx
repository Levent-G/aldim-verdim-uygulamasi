import React from "react";
import { Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import FootballerSVG from "../../takimSecimi/components/FootballerSVG";

export default function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={3}>
        <FootballerSVG color="black" />
        <Typography
          variant="h5"
          component="h2"
          fontWeight={900}
          textAlign="center"
        >
          Oyuncu & Kaptan Seçimi
        </Typography>
        <FootballerSVG color="white" />
      </Box>
    </motion.div>
  );
}
