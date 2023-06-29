import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Components/App'
import { BrowserRouter } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Provider } from 'react-redux'
import store from './app/store'
import ToggleColorModeProvider from './utils/ToggleColorMode'

const theme = createTheme({});

ReactDOM.createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <ToggleColorModeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </ToggleColorModeProvider>
  </Provider>,
)
