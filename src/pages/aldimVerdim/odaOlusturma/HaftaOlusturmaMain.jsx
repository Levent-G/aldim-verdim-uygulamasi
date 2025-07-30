import {
  Box,
  Paper,
  Divider,
  useTheme,
  Container,
  Typography,
  useMediaQuery,
} from "@mui/material";
import WeekList from "./components/WeekList";
import JoinWeekForm from "./components/JoinWeekForm";
import CreateWeekForm from "./components/CreateWeekForm";

const HaftaOlusturmaMain = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #f0f4ff, #dbeafe)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 4,
          bgcolor: "rgba(255,255,255,0.9)",
          borderRadius: 4,
          boxShadow: 8,
          p: isMobile ? 2 : 4,
          width: "100%",
        }}
      >
        {/* SOL PANEL */}
        <Box
          sx={{
            width: isMobile ? "100%" : 300,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            flexShrink: 0,
          }}
        >
          {/* Odaya Katıl */}
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: "white",
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              🚀 Odaya Katıl
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280", mb: 2 }}>
              Arkadaşlarının oluşturduğu bir haftaya katılmak için oda kodunu
              gir.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <JoinWeekForm />
          </Paper>

          {/* Oda Oluştur */}
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: "white",
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              🛠️ Oda Oluştur
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280", mb: 2 }}>
              Kendi haftanı oluştur, arkadaşlarını davet et ve oyunu başlat!
            </Typography>
            <Divider sx={{ my: 2 }} />
            <CreateWeekForm />
          </Paper>
        </Box>

        {/* SAĞ PANEL */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            width: "100%",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "white",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                color: "#1e40af",
                mb: 1,
              }}
            >
              📅 Aktif Haftalar
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#475569",
                mb: 3,
              }}
            >
              Mevcut aktif haftalara göz atabilir, dilediğine katılabilirsin.
              Unutma, eğlence burada!
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <WeekList />
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default HaftaOlusturmaMain;
