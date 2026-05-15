import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#090979',
    },

    secondary: {
      main: '#1B3FAF',
    },

    background: {
      default: '#F5F7FB',
    },
  },

  shape: {
    borderRadius: 14,
  },

  typography: {
    fontFamily: 'Inter',
  },
})