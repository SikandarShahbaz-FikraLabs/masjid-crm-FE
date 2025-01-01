import React, {
  useEffect,
  useState,
} from 'react'
import {
  useParams,
  useNavigate,
} from 'react-router-dom'
import {
  getPledger,
  updatePledger,
  addContact
} from '../services/api'
import {
  Typography,
  Button,
  Box,
  TextField,
  Paper
} from '@mui/material'
import Loader from '../components/Loader'
import Notification from '../components/Notification'
import ContactsList from '../components/ContactsList'
import { formatDate } from '../utils/formatters'

export default function PledgersEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pledger, setPledger] = useState(null)
  const [contacts, setContacts] = useState([])
  const [pledges, setPledges] = useState([])
  const [loading, setLoading] = useState(false)
  const [notif, setNotif] = useState({
    open:false,
    message:'',
    severity:'info'
  })

  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await getPledger(id)
      setPledger(res.data.pledger)
      setContacts(res.data.contacts)
      setPledges(res.data.pledges)
      setEditName(res.data.pledger.name)
      setEditEmail(res.data.pledger.email)
      setEditPhone(res.data.pledger.phone)
    } catch {
      setNotif({
        open:true,
        message:'Failed to load data',
        severity:'error'
      })
    }
    setLoading(false)
  }

  const handleSavePledger = async () => {
    try {
      setLoading(true)
      await updatePledger(id, {
        name: editName,
        email: editEmail,
        phone: editPhone
      })
      setNotif({
        open:true,
        message:'Pledger updated',
        severity:'success'
      })
      loadData()
    } catch {
      setNotif({
        open:true,
        message:'Failed to update pledger',
        severity:'error'
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading && !pledger) return <Loader />
  if (!pledger && !loading) return <Typography>Not found</Typography>

  return (
    <Box>
      {loading && pledger && <Loader />}
      <Button
        onClick={() => navigate('/pledgers')}
        sx={{ mb:2 }}
        variant="outlined"
      >
        Back
      </Button>
      <Typography variant="h4" mb={2}>
        Pledger
      </Typography>

      <Paper sx={{ mb:4, p:2 }}>
        <TextField
          label="Name"
          value={editName}
          onChange={e => setEditName(e.target.value)}
          fullWidth
          sx={{ mb:2 }}
        />
        <TextField
          label="Email"
          value={editEmail}
          onChange={e => setEditEmail(e.target.value)}
          fullWidth
          sx={{ mb:2 }}
        />
        <TextField
          label="Phone"
          value={editPhone}
          onChange={e => setEditPhone(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          sx={{ mt:2 }}
          onClick={handleSavePledger}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Pledger'}
        </Button>
      </Paper>

      <ContactsList
        contacts={contacts}
        onAdd={async (data) => {
          setLoading(true)
          try {
            await addContact({
              ...data,
              pledgerId:id
            })
            setNotif({
              open:true,
              message:'Contact added',
              severity:'success'
            })
            loadData()
          } catch {
            setNotif({
              open:true,
              message:'Failed to add contact',
              severity:'error'
            })
          } finally {
            setLoading(false)
          }
        }}
      />

      <Typography variant="h5" sx={{ mt:4, mb:2 }}>
        Pledges for {pledger.name}
      </Typography>
      {pledges.length === 0 ? (
        <Typography>No pledges found</Typography>
      ) : (
        <Paper sx={{ p:2, mb:4 }}>
          {pledges.map(pl => (
            <Box
              key={pl._id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                borderBottom:'1px solid #eee',
                py:1,
                '&:last-child': {
                  borderBottom:'none'
                }
              }}
            >
              <Typography>
                ${pl.pledgeAmount} pledge imported on {formatDate(pl.createdAt)}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate(`/pledges/${pl._id}`)}
              >
                View
              </Button>
            </Box>
          ))}
        </Paper>
      )}

      <Notification
        open={notif.open}
        message={notif.message}
        severity={notif.severity}
        onClose={() => setNotif({ ...notif, open:false })}
      />
    </Box>
  )
}
