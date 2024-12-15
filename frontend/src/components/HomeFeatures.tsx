import { Box, Paper, Typography, useTheme } from '@mui/material';

interface HomeFeaturesProps {
  refs: {
    section1Ref: React.RefObject<HTMLDivElement>;
  };
}

const HomeFeatures = (props: HomeFeaturesProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        padding: '2rem 0',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
      }}
      ref={props.refs.section1Ref}
    >
      <Box>
        <Typography
          variant="h1"
          sx={{ fontWeight: 'bold', letterSpacing: '0.25em' }}
        >
          Coming Soon
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          margin: '3rem 0',
          justifyContent: 'space-between',
        }}
      >
        <Paper
          elevation={2}
          sx={{
            backgroundColor: theme.palette.bluePrimary.main,
          }}
        >
          <Box sx={{ padding: '2rem' }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                color: theme.palette.graySecondary.main,
              }}
            >
              Calendar
            </Typography>
          </Box>
        </Paper>
        <Paper
          elevation={2}
          sx={{
            backgroundColor: theme.palette.bluePrimary.main,
          }}
        >
          <Box sx={{ padding: '2rem' }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                color: theme.palette.graySecondary.main,
              }}
            >
              Set Goals
            </Typography>
          </Box>
        </Paper>
        <Paper
          elevation={2}
          sx={{
            backgroundColor: theme.palette.bluePrimary.main,
          }}
        >
          <Box sx={{ padding: '2rem' }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                color: theme.palette.graySecondary.main,
              }}
            >
              Habit Tracker
            </Typography>
          </Box>
        </Paper>
        <Paper
          elevation={2}
          sx={{
            backgroundColor: theme.palette.bluePrimary.main,
          }}
        >
          <Box sx={{ padding: '2rem' }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                color: theme.palette.graySecondary.main,
              }}
            >
              Kanban
            </Typography>
          </Box>
        </Paper>
        <Paper
          elevation={4}
          sx={{
            backgroundColor: theme.palette.bluePrimary.main,
          }}
        >
          <Box sx={{ padding: '2rem' }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                color: theme.palette.graySecondary.main,
              }}
            >
              Notebook
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default HomeFeatures;
