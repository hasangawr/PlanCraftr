import {
  Box,
  Button,
  Grid2,
  Link,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import useBreakpoints from '../hooks/useBreakpoints';
import TypewriterComponent from 'typewriter-effect';
import { useState } from 'react';

const Home2 = () => {
  const theme = useTheme();
  const { isSmall, isMedium } = useBreakpoints();
  const [currentTitle, setCurrentTitle] = useState('');

  const features = [
    {
      title: 'Planner',
      message: 'Take control of your day with a smart planner 📅',
    },
    {
      title: 'Habit Tracker',
      message: 'Build positive habits and break the bad ones 💪',
    },
    {
      title: 'Calendar',
      message: 'Stay organized and never miss an important date 🗓️',
    },
    {
      title: 'Notebook',
      message: 'Capture your thoughts, ideas, and to-do lists in one place 📝',
    },
    {
      title: 'Notifier',
      message:
        'Stay informed and productive with timely notifications for tasks, deadlines and events 🔔',
    },
    {
      title: 'And More!',
      message:
        'Explore a range of productivity tools crafted to help you work smarter 🚀',
    },
  ];

  return (
    <Box>
      <Grid2 container spacing={0} sx={{ minHeight: '100vh' }}>
        <Grid2
          size={isMedium ? 0 : 7}
          sx={{
            color: theme.palette.textPrimary.main,
            background:
              'linear-gradient(109.6deg, rgb(20, 30, 48) 11.2%, rgb(36, 59, 85) 91.1%)',
            padding: '1.375rem 2rem',
            display: isMedium ? 'none' : 'block',
          }}
        >
          <Typography
            variant="h2"
            sx={{ letterSpacing: '0.15rem', fontWeight: 'bold' }}
          >
            PlanCraftr
          </Typography>
          <Box sx={{ position: 'relative', top: '35%' }}>
            <Typography variant="h1" sx={{ fontWeight: 'bold' }}>
              {currentTitle}
            </Typography>
            <Typography variant="h1" sx={{ letterSpacing: '0.15rem' }}>
              <TypewriterComponent
                options={{
                  autoStart: true,
                  loop: true,
                  cursor: '_',
                  deleteSpeed: 10,
                }}
                onInit={(typewriter) => {
                  for (const feature of features) {
                    typewriter
                      .callFunction(() => {
                        setCurrentTitle(feature.title);
                      })
                      .typeString(feature.message)
                      .pauseFor(1500)
                      .deleteAll()
                      .start();
                  }
                }}
              />
            </Typography>
          </Box>
        </Grid2>
        <Grid2
          size={isMedium ? 12 : 5}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            padding: '1.375rem 2rem',
          }}
        >
          <Stack
            direction="column"
            gap={0}
            sx={
              {
                //padding: '1.375rem 2rem',
              }
            }
          >
            <Typography
              variant="h2"
              sx={{
                letterSpacing: '0.15rem',
                fontWeight: 'bold',
                color: theme.palette.textPrimary.main,
                display: isMedium ? 'block' : 'none',
              }}
            >
              PlanCraftr
            </Typography>
            {/* {upper} */}
            <Box
              sx={{
                // position: 'relative',
                // top: '75%',
                color: theme.palette.textPrimary.main,
                textAlign: 'center',
                minHeight: isMedium ? '85vh' : '90vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Box>
                <Box>
                  <Typography
                    variant="h1"
                    sx={{ letterSpacing: '0.15rem', fontWeight: 'bold' }}
                  >
                    Get started
                  </Typography>
                </Box>

                <Stack
                  direction={isSmall ? 'column' : 'row'}
                  gap={2}
                  sx={{
                    margin: '1rem auto',
                    justifyContent: 'center',
                    maxWidth: '440px',
                    maxHeight: '6rem',
                  }}
                >
                  <Button
                    sx={{
                      backgroundColor: theme.palette.bluePrimary.main,
                      color: theme.palette.textPrimary.main,
                      minHeight: '2.875rem',
                      padding: '0.75rem 1rem',
                      flex: '0 1 15rem',
                      borderRadius: '1000px',
                      ':hover': {
                        backgroundColor: theme.palette.bluePrimary.dark,
                      },
                    }}
                    href="/login"
                  >
                    Log in
                  </Button>
                  <Button
                    sx={{
                      backgroundColor: theme.palette.bluePrimary.main,
                      color: theme.palette.textPrimary.main,
                      minHeight: '2.875rem',
                      padding: '0.75rem 1rem',
                      flex: '0 1 15rem',
                      borderRadius: '1000px',
                      ':hover': {
                        backgroundColor: theme.palette.bluePrimary.dark,
                      },
                    }}
                    href="/register"
                  >
                    Sign up
                  </Button>
                </Stack>
              </Box>
            </Box>

            {/* {lower} */}
            <Box>
              <Stack
                gap="1rem"
                direction="row"
                sx={{
                  color: theme.palette.graySecondary.main,
                  justifyContent: 'center',
                }}
              >
                <Link
                  sx={{
                    color: theme.palette.graySecondary.main,
                    ':hover': {
                      cursor: 'pointer',
                    },
                  }}
                >
                  <Typography variant="body2">Terms & conditions</Typography>
                </Link>
                <span>|</span>
                <Link
                  sx={{
                    color: theme.palette.graySecondary.main,
                    ':hover': {
                      cursor: 'pointer',
                    },
                  }}
                >
                  <Typography variant="body2">Privacy policy</Typography>
                </Link>
              </Stack>
            </Box>
          </Stack>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Home2;
