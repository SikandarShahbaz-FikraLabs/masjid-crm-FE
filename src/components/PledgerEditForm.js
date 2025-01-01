import React, { useState } from 'react'
import {
  Paper,
  Box,
  TextField,
  Button,
  Typography,
} from '@mui/material'
import { formatDate } from '../utils/formatters'

export default function PledgerEditForm({
  pledger,
  onSave
}) {
  const [name, setName] = useState(pledger.name || '')
  const [email, setEmail] = useState(pledger.email || '')
  const [phone, setPhone] = useState(pledger.phone || '')
  const [pledgeAmount, setPledgeAmount] = useState(pledger.pledgeAmount || 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ 
        name, 
        email, 
        phone, 
        pledgeAmount: Number(pledgeAmount),
    })
  }

  return (
    <Paper
      sx={{
        p:2,
        mb:2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <Typography
          variant="h5"
          sx={{ mb:2 }}
        >
          Personal Details
        </Typography>
        <TextField
          label="Name"
          value={name}
          onChange={e=>setName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label="Phone"
          value={phone}
          onChange={e=>setPhone(e.target.value)}
          fullWidth
        />
        <TextField
          label="Pledge Amount (CA$)"
          type="number"
          value={pledgeAmount}
          onChange={e=>setPledgeAmount(Number(e.target.value))}
          fullWidth
        />
        <Typography
          variant="body1"
          color="text.secondary"
        >
          Created: {formatDate(pledger.createdAt)}
        </Typography>
        <Button
          variant="contained"
          type="submit"
        >
          Save
        </Button>
      </Box>
    </Paper>
  )
}
