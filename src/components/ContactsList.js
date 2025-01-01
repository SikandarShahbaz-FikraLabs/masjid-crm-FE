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
  MenuItem
} from '@mui/material'
import { formatDate } from '../utils/formatters'

export default function ContactsList({
  contacts,
  onAdd
}) {
  const [date, setDate] = useState('')
  const [method, setMethod] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await onAdd({ date, method, note })
      setDate('')
      setMethod('')
      setNote('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper
      sx={{
        p:2,
        mb:2,
      }}
    >
      <Typography
        variant="h5"
        sx={{ mb:2 }}
      >
        Contact History
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Method</TableCell>
            <TableCell>Note</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                <Typography color="text.secondary">
                  No contacts recorded
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            contacts.map(c => (
              <TableRow key={c._id}>
                <TableCell>{formatDate(c.date)}</TableCell>
                <TableCell>{c.method}</TableCell>
                <TableCell>{c.note}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Typography
        variant="subtitle1"
        sx={{
          mt: 3,
          mb: 1,
        }}
      >
        Add Contact Point
      </Typography>
      <Box
        component="form"
        onSubmit={handleAdd}
        display="flex"
        flexDirection="column"
        gap={2}
        mt={2}
      >
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
          select
          label="Method"
          value={method}
          onChange={e=>setMethod(e.target.value)}
          fullWidth
          required
        >
          <MenuItem value="Phone">
            Phone
          </MenuItem>
          <MenuItem value="Email">
            Email
          </MenuItem>
        </TextField>
        <TextField
          label="Note"
          value={note}
          onChange={e=>setNote(e.target.value)}
          multiline
          rows={3}
          fullWidth
          required
        />
        <Button
          variant="contained"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Add'}
        </Button>
      </Box>
    </Paper>
  )
}
