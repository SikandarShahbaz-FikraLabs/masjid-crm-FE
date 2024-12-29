import React, { 
    useEffect, 
    useState 
} from 'react'
import { 
    useParams, 
    useNavigate 
} from 'react-router-dom'
import {
  getPledger,
  updatePledger,
  getContacts,
  addContact,
  getPayments,
  addPayment
} from '../services/api'
import PledgerEditForm from '../components/PledgerEditForm'
import ContactsList from '../components/ContactsList'
import PaymentsList from '../components/PaymentsList'
import {
  Typography,
  Button
} from '@mui/material'
import Loader from '../components/Loader'
import Notification from '../components/Notification'

export default function PledgersEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pledger, setPledger] = useState(null)
  const [contacts, setContacts] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [notif, setNotif] = useState({
    open:false,
    message:'',
    severity:'info'
  })

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    setLoading(true)
    try {
      const pRes = await getPledger(id)
      setPledger(pRes.data)
      const cRes = await getContacts(id)
      setContacts(cRes.data)
      const payRes = await getPayments(id)
      setPayments(payRes.data)
    } catch {
      setNotif({
        open: true,
        message: 'Failed to load data',
        severity: 'error',
      })
    }
    setLoading(false)
  }

  const handleSavePledger = async (data) => {
    setLoading(true)
    try {
      await updatePledger(id, data)
      setNotif({
        open: true,
        message: 'Pledger updated',
        severity: 'success',
      })
      loadData()
    } catch {
      setNotif({
        open: true,
        message: 'Failed to update pledger',
        severity: 'error',
      })
      setLoading(false)
    }
  }

  const handleAddContact = async (contactData) => {
    setLoading(true)
    try {
      await addContact({ ...contactData, pledgerId: id })
      setNotif({
        open: true,
        message: 'Contact added',
        severity: 'success',
      })
      loadData()
    } catch {
      setNotif({
        open: true,
        message: 'Failed to add contact',
        severity: 'error',
      })
      setLoading(false)
    }
  }

  const handleAddPayment = async (paymentData) => {
    setLoading(true)
    try {
      await addPayment({ ...paymentData, pledgerId: id })
      setNotif({
        open: true,
        message: 'Payment added',
        severity: 'success',
      })
      loadData()
    } catch {
      setNotif({
        open: true,
        message: 'Failed to add payment',
        severity: 'error',
      })
      setLoading(false)
    }
  }

  if (loading && !pledger) return <Loader />

  if (!pledger && !loading) return <Typography>Not found</Typography>

  return (
    <div>
      {loading && <Loader />}
      <Button 
        onClick={() => navigate('/')} 
        sx={{ mb: 2 }}
        variant="outlined"
      >
        Back
      </Button>
      <Typography variant="h4" mb={2}>
        Edit Pledger
      </Typography>
      <PledgerEditForm
        pledger={pledger}
        onSave={handleSavePledger}
      />
      <ContactsList
        contacts={contacts}
        onAdd={handleAddContact}
      />
      <PaymentsList
        payments={payments}
        onAdd={handleAddPayment}
        pledgeAmount={pledger.pledgeAmount}
      />
      <Notification
        open={notif.open}
        message={notif.message}
        severity={notif.severity}
        onClose={()=>setNotif({...notif,open:false})}
      />
    </div>
  )
}
