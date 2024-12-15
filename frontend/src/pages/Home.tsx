import { Box, Container } from '@mui/material';
import Header from '../components/Header';
import Hero from '../components/Hero';
import { useRef } from 'react';
import Footer from '../components/Footer';
import HomeFeatures from '../components/HomeFeatures';

const Home = () => {
  const section1Ref = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Box
        sx={{
          background:
            'linear-gradient(109.6deg, rgb(20, 30, 48) 11.2%, rgb(36, 59, 85) 91.1%);',
          minHeight: '100vh',
          width: '100vw',
        }}
      >
        <Container maxWidth="lg" sx={{ height: '100vh' }}>
          <Header refs={{ section1Ref }} scrollToSection={scrollToSection} />
          <Hero />
        </Container>
      </Box>
      <Container maxWidth="lg">
        <HomeFeatures refs={{ section1Ref }} />
      </Container>
      <Box
        sx={{
          background:
            'linear-gradient(109.6deg, rgb(20, 30, 48) 11.2%, rgb(36, 59, 85) 91.1%);',
          width: '100vw',
        }}
      >
        <Container maxWidth="lg">
          <Footer />
        </Container>
      </Box>
    </>
  );
};

export default Home;
