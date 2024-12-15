import { Box, Stack, Typography, useTheme } from '@mui/material';
import CopyrightRoundedIcon from '@mui/icons-material/CopyrightRounded';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 0',
      }}
    >
      <Stack direction="row" spacing={0.5} alignItems="center">
        <CopyrightRoundedIcon
          sx={{ color: theme.palette.background.default, fontSize: '0.875rem' }}
        />
        <Typography variant="body1" color={theme.palette.background.default}>
          PlanCraftr.
        </Typography>
        <Typography variant="body1" color={theme.palette.background.default}>
          All rights reserved
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        <FacebookIcon
          sx={{
            color: theme.palette.background.default,
            ':hover': { color: theme.palette.graySecondary.main },
            cursor: 'pointer',
          }}
        />
        <InstagramIcon
          sx={{
            color: theme.palette.background.default,
            ':hover': { color: theme.palette.graySecondary.main },
            cursor: 'pointer',
          }}
        />
        <LinkedInIcon
          sx={{
            color: theme.palette.background.default,
            ':hover': { color: theme.palette.graySecondary.main },
            cursor: 'pointer',
          }}
        />
      </Stack>
    </Box>
  );
};

export default Footer;
