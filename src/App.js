import React, {
  useState,
  useEffect,
} from 'react'
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
import PledgesList from './pages/PledgesList'
import PledgesEdit from './pages/PledgesEdit'
import Notification from './components/Notification'
import Loader from './components/Loader'
import { io } from 'socket.io-client'

export default function App() {
  const [activeJobs, setActiveJobs] = useState([])

  useEffect(() => {
    const socket = io('http://localhost:4000')
    socket.on('jobWaiting', (data) => {
      setActiveJobs(prev => [...prev, data.jobId])
    })
    socket.on('jobActive', (data) => {
      setActiveJobs(prev => {
        if (!prev.includes(data.jobId)) {
          return [...prev, data.jobId]
        }
        return prev
      })
    })
    socket.on('jobCompleted', (data) => {
      setActiveJobs(prev => prev.filter(id => id !== data.jobId))
    })
    socket.on('jobFailed', (data) => {
      setActiveJobs(prev => prev.filter(id => id !== data.jobId))
    })
    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              sx={{ flexGrow: 1 }}
            >
              Masjid CRM
            </Typography>
            <Button
              color="inherit"
              component={Link}
              to="/pledges"
            >
              Pledges
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/pledgers"
            >
              Pledgers
            </Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ py: 4 }}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={
                  <motion.div
                    initial={{ opacity:0, y:20 }}
                    animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0, y:-20 }}
                    transition={{ duration:0.3 }}
                  >
                    <PledgesList />
                  </motion.div>
                }
              />
              <Route
                path="/pledges"
                element={
                  <motion.div
                    initial={{ opacity:0, y:20 }}
                    animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0, y:-20 }}
                    transition={{ duration:0.3 }}
                  >
                    <PledgesList />
                  </motion.div>
                }
              />
              <Route
                path="/pledges/:id"
                element={
                  <motion.div
                    initial={{ opacity:0, y:20 }}
                    animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0, y:-20 }}
                    transition={{ duration:0.3 }}
                  >
                    <PledgesEdit />
                  </motion.div>
                }
              />
              <Route
                path="/pledgers"
                element={
                  <motion.div
                    initial={{ opacity:0, y:20 }}
                    animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0, y:-20 }}
                    transition={{ duration:0.3 }}
                  >
                    <PledgersList />
                  </motion.div>
                }
              />
              <Route
                path="/pledgers/:id"
                element={
                  <motion.div
                    initial={{ opacity:0, y:20 }}
                    animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0, y:-20 }}
                    transition={{ duration:0.3 }}
                  >
                    <PledgersEdit />
                  </motion.div>
                }
              />
            </Routes>
          </AnimatePresence>
        </Container>
      </Router>
      {activeJobs.length > 0 && (
        <Notification
          open
          message={
            <>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px' 
              }}>
                <Loader />
                <strong>Sending emails/texts to pledgers...</strong>
              </span>
            </>
          }
          severity="info"
          autoHideDuration={null}
          onClose={() => {}}
        />
      )}
    </ThemeProvider>
  )
}
