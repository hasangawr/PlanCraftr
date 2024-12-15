import { createTheme, PaletteColor, PaletteColorOptions } from '@mui/material';

// Extend the Palette interface to include custom colors
declare module '@mui/material/styles' {
  interface Palette {
    graySecondary: PaletteColor;
    grayPrimary: PaletteColor;
    bluePrimary: PaletteColor;
    blackPrimary: PaletteColor;
  }
  interface PaletteOptions {
    graySecondary?: PaletteColorOptions;
    grayPrimary?: PaletteColorOptions;
    bluePrimary?: PaletteColorOptions;
    blackPrimary?: PaletteColorOptions;
  }
}

const mainTheme = createTheme({
  typography: {
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
    },
    blackPrimary: {
      main: '#111927',
    },
  },
});

export default mainTheme;
