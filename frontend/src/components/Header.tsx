import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import { useNavigate } from 'react-router-dom';

interface navigationProps {
  scrollToSection: (ref: React.RefObject<HTMLDivElement>) => void;
  refs: {
    section1Ref: React.RefObject<HTMLDivElement>;
  };
}

const Header = (props: navigationProps) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        maxHeight: '2.625rem',
        padding: '2rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ cursor: 'pointer', userSelect: 'none' }}
        onClick={() => {
          navigate('/');
        }}
      >
        {/* TODO: replace with logo */}
        <NotesRoundedIcon sx={{ color: theme.palette.bluePrimary.main }} />
        <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
          <span style={{ color: theme.palette.background.default }}>Plan</span>
          <span style={{ color: theme.palette.bluePrimary.main }}>Craftr</span>
        </Typography>
      </Stack>
      <Stack
        direction="row"
        spacing={5}
        alignItems="center"
        color={theme.palette.background.default}
      >
        <Box
          sx={{
            ':hover': { color: theme.palette.graySecondary.main },
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onClick={() => {
            navigate('#');
          }}
        >
          <Typography variant="body1">Platform</Typography>
        </Box>
        <Box
          sx={{
            ':hover': { color: theme.palette.graySecondary.main },
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onClick={() => {
            props.scrollToSection(props.refs.section1Ref);
          }}
        >
          <Typography variant="body1">Features</Typography>
        </Box>
        <Box
          sx={{
            ':hover': { color: theme.palette.graySecondary.main },
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onClick={() => {
            navigate('#');
          }}
        >
          <Typography variant="body1">Pricing</Typography>
        </Box>
        <Box
          sx={{
            ':hover': { color: theme.palette.graySecondary.main },
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onClick={() => {
            navigate('#');
          }}
        >
          <Typography variant="body1">Blog</Typography>
        </Box>
      </Stack>
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" href="/login">
          Log In
        </Button>
        <Button variant="outlined" href="/register">
          Create Account
        </Button>
      </Stack>
    </Box>
  );
};

export default Header;
