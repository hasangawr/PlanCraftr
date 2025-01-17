import { createTheme, PaletteColor, PaletteColorOptions } from '@mui/material';

// Extend the Palette interface to include custom colors
declare module '@mui/material/styles' {
  interface Palette {
    graySecondary: PaletteColor;
    grayPrimary: PaletteColor;
    bluePrimary: PaletteColor;
    blackPrimary: PaletteColor;
    backgroundPrimary: PaletteColor;
    textPrimary: PaletteColor;
  }
  interface PaletteOptions {
    graySecondary?: PaletteColorOptions;
    grayPrimary?: PaletteColorOptions;
    bluePrimary?: PaletteColorOptions;
    blackPrimary?: PaletteColorOptions;
    backgroundPrimary?: PaletteColorOptions;
    textPrimary?: PaletteColorOptions;
  }
}

const mainTheme = createTheme({
  typography: {
    fontFamily: ['Roboto'].join(','),
    h1: {
      fontSize: '2.294rem',
      //letterSpacing: '0.15em',
    },
    h2: {
      fontSize: '1.456rem',
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
  },
  palette: {
    background: {
      default: '#ffffff',
    },
    graySecondary: {
      main: '#f7f7f7',
    },
    grayPrimary: {
      main: '#6C737F',
    },
    bluePrimary: {
      main: '#6366F1',
      dark: '#4e46e5',
    },
    blackPrimary: {
      main: '#111927',
    },
    textPrimary: {
      main: '#ffffff',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1200,
    },
  },
});

export default mainTheme;
