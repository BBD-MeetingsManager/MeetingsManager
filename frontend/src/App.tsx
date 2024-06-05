import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import './App.css'
import Landing from './pages/Landing'
import Redirect from './pages/Redirect'
import SignOut from './pages/SignOut'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import {paths} from "./enums/paths.tsx";

function App() {

  const router = createBrowserRouter([
    {
      path: paths.landingPage,
      element: <Landing />,
      index: true
    },
    {
      path: paths.home,
      element: <Home />
    },
    {
      path: paths.redirect,
      element: <Redirect />,
    },
    {
      path: paths.signOut,
      element: <SignOut />,
    }
  ])
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1b76ff'
      },
      secondary: {
        main: '#323f49'
      }
    }
  })

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  )
}

export default App
