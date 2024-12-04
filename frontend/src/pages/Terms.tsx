import { Box, Paper, Typography } from '@mui/material';

const Terms = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        sx={{
          height: '70vh',
          width: '60%',
          margin: '0 2rem',
          padding: '1.4rem 1.8rem',
          backgroundColor: '#bebffa',
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Terms & Conditions
          </Typography>
        </Box>
        <Box sx={{ marginTop: '0.5rem' }}>
          <Typography>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad minus
            unde dicta, ducimus atque suscipit repellat officia? Eligendi,
            repellendus minima animi numquam reiciendis placeat tenetur iusto
            voluptatum, delectus alias hic totam? Omnis rerum tempora aperiam
            ducimus praesentium, fugiat, nobis iusto explicabo labore, sed
            itaque enim! Dolor repudiandae a praesentium dolores.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Terms;
