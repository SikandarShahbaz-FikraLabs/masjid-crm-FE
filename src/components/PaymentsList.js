import React, { useState } from 'react'
import {
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress
} from '@mui/material'
import { formatCurrency, formatDate } from '../utils/formatters'

export default function PaymentsList({
  payments,
  onAdd,
  pledgeAmount
}) {
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    onAdd({
      date,
      amount: Number(amount),
      note
    })
    setDate('')
    setAmount('')
    setNote('')
  }

  const totalPaid = payments.reduce((sum, pay) => sum + pay.amount, 0)
  const percentage = pledgeAmount > 0 ? (totalPaid / pledgeAmount) * 100 : 0

  return (
    <Paper sx={{ p:2, mb:2 }}>
      <Typography variant="h5" sx={{ mb:2 }}>
        Payment History
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Note</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                <Typography color="text.secondary">No payments recorded</Typography>
              </TableCell>
            </TableRow>
          ) : (
            payments.map(p => (
              <TableRow key={p._id}>
                <TableCell>{formatDate(p.date)}</TableCell>
                <TableCell>{formatCurrency(p.amount)}</TableCell>
                <TableCell>{p.note}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Box display="flex" alignItems="center" gap={2} mt={3}>
        <Box position="relative" display="inline-flex">
          <CircularProgress variant="determinate" value={percentage} size={110} />
          <Box
            position="absolute"
            top={0}
            left={0}
            bottom={0}
            right={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="caption" component="div" color="text.secondary">
              {`${Math.round(percentage)}%`} Paid
            </Typography>
          </Box>
        </Box>
      </Box>
      <Typography variant="subtitle1" sx={{ mt:3, mb:1 }}>
        Add Payment Point
      </Typography>
      <Box component="form" onSubmit={handleAdd} display="flex" flexDirection="column" gap={2} mt={2}>
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={e=>setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            sx: {
              '& ::-webkit-calendar-picker-indicator': {
                filter: 'invert(0.7)',
                scale: '1.5',
                cursor: 'pointer'
              }
            }
          }}
          fullWidth
          required
        />
        <TextField
          label="Amount (CA$)"
          type="number"
          value={amount}
          onChange={e=>setAmount(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Note"
          value={note}
          onChange={e=>setNote(e.target.value)}
          multiline
          rows={3}
          fullWidth
          required
        />
        <Button variant="contained" type="submit">
          Add
        </Button>
      </Box>
    </Paper>
  )
}
