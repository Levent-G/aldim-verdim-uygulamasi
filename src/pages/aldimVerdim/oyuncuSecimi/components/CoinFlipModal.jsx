import React, {  useState, useRef } from "react";
import {
  Box,
  Button,
  Modal,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";


export default function CoinFlipModal() {
  const [open, setOpen] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [currentFace, setCurrentFace] = useState(null);
  const [result, setResult] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const intervalRef = useRef(null);

  const handleOpen = () => {
    const initial = Math.random() > 0.5 ? "YAZI" : "TURA";
    setCurrentFace(initial);
    setResult(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    clearInterval(intervalRef.current);
    setIsFlipping(false);
    setResult(null);
  };

  const handleFlip = () => {
    if (isFlipping) return;

    setIsFlipping(true);
    setResult(null);

    intervalRef.current = setInterval(() => {
      setCurrentFace((prev) => (prev === "YAZI" ? "TURA" : "YAZI"));
    }, 100); // 100ms’de bir yüz değiştir

    setTimeout(() => {
      clearInterval(intervalRef.current);
      const final = Math.random() > 0.5 ? "YAZI" : "TURA";
      setCurrentFace(final);
      setResult(final);
      setIsFlipping(false);
    }, 2000); // 2 saniye sonra sonucu göster
  };

  // Görsel yolları
  const getCoinImage = () => {
    if (currentFace === "YAZI") return "/1TL_obverse.png"; // T.C.
    if (currentFace === "TURA") return "/1TL_reverse.png"; // ₺1
    return "/1TL_obverse.png"; // varsayılan
  };

  return (
    <>
      {/* Sağ alt sabit buton */}
      <Box >
        <Button variant="contained" color="error" onClick={handleOpen}>
          Yazı Tura
        </Button>
      </Box>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#f5f5f5",
            borderRadius: 4,
            p: 4,
            outline: "none",
            boxShadow: 24,
            minWidth: isMobile ? 280 : 400,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" mb={2} fontWeight={700}>
            Yazı Tura At
          </Typography>

          {/* Bozuk Para PNG */}
          <Box
            component={motion.div}
            animate={{ rotateY: isFlipping ? 1080 : 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            sx={{
              width: 140,
              height: 140,
              mx: "auto",
              mb: 2,
              borderRadius: "50%",
              backgroundImage: `url(${getCoinImage()})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
              transformStyle: "preserve-3d",
              perspective: 1000,
            }}
          />

          {/* Sonuç */}
          {result && (
            <Typography variant="h5" fontWeight={600} color="primary" mb={2}>
              {result}
            </Typography>
          )}

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              onClick={handleFlip}
              disabled={isFlipping}
            >
              Başla
            </Button>
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={isFlipping}
            >
              Kapat
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
