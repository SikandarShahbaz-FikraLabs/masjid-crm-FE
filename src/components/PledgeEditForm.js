import React, { useState } from 'react'
import {
  Paper,
  Box,
  TextField,
  Button,
  Typography,
} from '@mui/material'

export default function PledgeEditForm({
  pledge,
  onSave
}) {
  const [pledgerId, setPledgerId] = useState(pledge.pledgerId || '')
  const [pledgeAmount, setPledgeAmount] = useState(pledge.pledgeAmount || 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      pledgerId,
      pledgeAmount: Number(pledgeAmount)
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
          Pledge Details
        </Typography>
        <TextField
          label="Pledger ID"
          value={pledgerId}
          onChange={e=>setPledgerId(e.target.value)}
          fullWidth
        />
        <TextField
          label="Pledge Amount (CA$)"
          type="number"
          value={pledgeAmount}
          onChange={e=>setPledgeAmount(Number(e.target.value))}
          fullWidth
        />
        <Button variant="contained" type="submit">
          Save
        </Button>
      </Box>
    </Paper>
  )
}
