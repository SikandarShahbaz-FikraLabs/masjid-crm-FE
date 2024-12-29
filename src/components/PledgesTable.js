import React from 'react'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Button
} from '@mui/material'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatCurrency, formatDate } from '../utils/formatters'

export default function PledgesTable({ pledges }) {
  return (
    <motion.div
      initial={{ opacity:0 }}
      animate={{ opacity:1 }}
      transition={{ duration:0.3 }}
    >
      <TableContainer component={Paper} sx={{ mt:2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Pledger</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Pledge Amount</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Created</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pledges.map((pl) => {
              const pledger = pl.pledgerId || {}
              return (
                <TableRow key={pl._id}>
                  <TableCell>{pledger.name || 'N/A'}</TableCell>
                  <TableCell>{pledger.email || 'N/A'}</TableCell>
                  <TableCell>{formatCurrency(pl.pledgeAmount)}</TableCell>
                  <TableCell>{pl.status ? pl.status.toUpperCase() : 'N/A'}</TableCell>
                  <TableCell>{formatDate(pl.createdAt)}</TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      to={`/pledges/${pl._id}`}
                      variant="outlined"
                      size="small"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </motion.div>
  )
}
