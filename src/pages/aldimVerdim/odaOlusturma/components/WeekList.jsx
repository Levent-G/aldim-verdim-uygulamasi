import { useCaptainContext } from "../../../../context/CaptainContext";
import { Card, CardContent, Typography, Grid, Chip, Box } from "@mui/material";

const WeekList = () => {
  const { weeks } = useCaptainContext();

  return (
    <Grid container spacing={2}>
      {weeks?.map(
        (week) =>
          !week?.isPrivate && (
            <Grid item xs={12} sm={6} key={week?.weekId}>
              <Card
                sx={{
                  cursor: "pointer",
                  backgroundColor: week?.isFinished ? "#f0f0f0" : "#ffffff",
                  opacity: week?.isFinished ? 0.6 : 1,
                  border: week?.isFinished ? "2px solid #999" : "1px solid #ddd",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.03)",
                  },
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                      ID: {week?.weekId}
                    </Typography>
                    {week?.isFinished && (
                      <Chip
                        label="BİTTİ"
                        color="error"
                        variant="outlined"
                        sx={{ fontWeight: "bold" }}
                      />
                    )}
                  </Box>

                  <Typography sx={{ mt: 1 }}>
                    Tarih: {new Date(Number(week?.weekId)).toLocaleDateString("tr-TR")}
                  </Typography>

                  <Typography sx={{ mt: 1 }}>
                    {Object.keys(week?.users || {}).length}/{week?.size} kişi
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )
      )}
    </Grid>
  );
};

export default WeekList;
