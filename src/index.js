import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Page from './components/Page'
import { Provider as StoreProvider } from 'react-redux'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import store from './store'
import SpeedBump from './components/SpeedBump'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2563eb', // Electric Blue
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7c3aed', // Purple
      light: '#a78bfa',
      dark: '#5b21b6',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Helvetica Neue", Arial, sans-serif',
    useNextVariants: true,
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    }
  },
  shape: {
    borderRadius: 12
  }
})

const App = () => {
  return <StoreProvider store={store}>
    <MuiThemeProvider theme={theme}>
      <SpeedBump />
      <Page />
    </MuiThemeProvider>
  </StoreProvider>
}

ReactDOM.render(<App />, document.getElementById('root'))
