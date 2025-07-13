import React from "react";
import {  Typography } from "@mui/material";
import FootballerSVG from "../../takimSecimi/components/FootballerSVG";

export default function Header() {
  return (
    <Typography
      component="div"
      textAlign="center"
      sx={{
        fontWeight: "900",
        mb: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
      }}
    >
      <FootballerSVG color="black" />
      <Typography variant="h5" component="span" sx={{ fontWeight: "900" }}>
        Oyuncu & Kaptan Seçimi
      </Typography>
      <FootballerSVG color="white" />
    </Typography>
  );
}
