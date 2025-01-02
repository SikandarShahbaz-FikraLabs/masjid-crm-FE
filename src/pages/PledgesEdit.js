import React, {
  useEffect,
  useState
} from 'react'
import {
  useParams,
  useNavigate
} from 'react-router-dom'
import {
  getPledge,
  addPayment,
  addContact
} from '../services/api'
import {
  Typography,
  Button,
  Box
} from '@mui/material'
import Loader from '../components/Loader'
import Notification from '../components/Notification'
import PaymentsList from '../components/PaymentsList'
import ContactsList from '../components/ContactsList'

export default function PledgesEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pledge, setPledge] = useState(null)
  const [pledger, setPledger] = useState(null)
  const [payments, setPayments] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false)
  const [notif, setNotif] = useState({
    open: false,
    message: '',
    severity: 'info'
  })

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    setLoading(true)
    try {
      const pRes = await getPledge(id)
      setPledge(pRes.data.pledge)
      setPledger(pRes.data.pledger)
      setPayments(pRes.data.payments)
      setContacts(pRes.data.contacts)
    } catch {
      setNotif({
        open: true,
        message: 'Failed to load data',
        severity: 'error'
      })
    }
    setLoading(false)
  }

  const handleAddPayment = async (paymentData) => {
    setLoading(true)
    try {
      await addPayment({
        ...paymentData,
        pledgeId: id
      })
      setNotif({
        open: true,
        message: 'Payment added',
        severity: 'success'
      })
      loadData()
    } catch {
      setNotif({
        open: true,
        message: 'Failed to add payment',
        severity: 'error'
      })
    }
    setLoading(false)
  }

  const handleEditPledger = () => {
    if (pledger && pledger._id) {
      navigate(`/pledgers/${pledger._id}`)
    }
  }

  if (loading && !pledge) return <Loader />
  if (!pledge && !loading) return <Typography>Not found</Typography>

  return (
    <Box>
      {loading && <Loader />}
      <Button
        onClick={() => navigate('/pledges')}
        sx={{ mb: 2 }}
        variant="outlined"
      >
        Back
      </Button>
      <Typography variant="h4" mb={2}>
        Edit Pledge
      </Typography>
      <Box
        sx={{
          mb: 4,
          p: 2,
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold' }}
        >
          Pledge Amount (CA$)
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: 'primary.main',
            mb: 2
          }}
        >
          {pledge?.pledgeAmount}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            mt: 2
          }}
        >
          Pledger
        </Typography>
        {pledger && (
          <Box sx={{ mb: 2 }}>
            <Typography>Name: {pledger.name}</Typography>
            <Typography>Email: {pledger.email}</Typography>
            <Typography>Phone: {pledger.phone}</Typography>
          </Box>
        )}
        <Button
          variant="contained"
          onClick={handleEditPledger}
        >
          View Pledger
        </Button>
      </Box>
      <ContactsList
        contacts={contacts}
        onAdd={async (data) => {
          setLoading(true)
          try {
            await addContact({
              ...data,
              pledgerId: pledger?._id,
              pledgeId: pledge?._id
            })
            loadData()
            setNotif({
              open: true,
              message: 'Contact added',
              severity: 'success'
            })
          } catch {
            setNotif({
              open: true,
              message: 'Failed to add contact',
              severity: 'error'
            })
          } finally {
            setLoading(false)
          }
        }}
      />
      <PaymentsList
        payments={payments}
        onAdd={handleAddPayment}
        pledgeAmount={pledge.pledgeAmount}
      />
      <Notification
        open={notif.open}
        message={notif.message}
        severity={notif.severity}
        onClose={() => setNotif({ ...notif, open: false })}
      />
    </Box>
  )
}
