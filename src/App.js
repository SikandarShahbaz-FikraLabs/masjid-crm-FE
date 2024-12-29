import React from 'react'
import { CssBaseline } from '@mui/material'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
} from '@mui/material'
import {
  AnimatePresence,
  motion,
} from 'framer-motion'
import PledgersList from './pages/PledgersList'
import PledgersEdit from './pages/PledgersEdit'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: 'center' }}>
            <Typography
              variant="h6"
              component="div"
            >
              Masjid Pledges CRM
            </Typography>
          </Toolbar>
        </AppBar>
        <Container sx={{ py: 4 }}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={
                  <motion.div
                    initial={{opacity:0,y:20}}
                    animate={{opacity:1,y:0}}
                    exit={{opacity:0,y:-20}}
                    transition={{duration:0.3}}
                  >
                    <PledgersList />
                  </motion.div>
                }
              />
              <Route
                path="/pledgers/:id"
                element={
                  <motion.div
                    initial={{opacity:0,y:20}}
                    animate={{opacity:1,y:0}}
                    exit={{opacity:0,y:-20}}
                    transition={{duration:0.3}}
                  >
                    <PledgersEdit />
                  </motion.div>
                }
              />
            </Routes>
          </AnimatePresence>
        </Container>
      </Router>
    </ThemeProvider>
  )
}
