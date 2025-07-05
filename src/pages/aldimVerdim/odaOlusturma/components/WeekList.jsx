import { Card, CardContent, Typography, Grid } from "@mui/material";
import { useCaptainContext } from "../../../../context/CaptainContext";

const WeekList = () => {
  const { weeks } = useCaptainContext();

  return (
    <Grid container spacing={2}>
      {weeks.map(
        (week) =>
          !week.isPrivate && (
            <Grid item xs={12} sm={6} key={week.weekId}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Week ID: {week.weekId}</Typography>
                  <Typography>
                    {Object.keys(week.users || {}).length}/{week.size} kişi
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
