import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import './App.css'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Redirect from './pages/Redirect'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Landing />,
    },
    {
      path: 'home',
      element: <Home />
    },
    {
      path: '/redirect',
      element: <Redirect />,
    }
  ])
  const theme = createTheme({
    palette: {
      primary: {
        main: '#97aebb'
      },
      secondary: {
        main: '#ff9233'
      }
    }
  })

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  )
}

export default App
