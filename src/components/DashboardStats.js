import React from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  CircularProgress
} from '@mui/material'
import { formatCurrency } from '../utils/formatters'

export default function DashboardStats({
  totalPledgers,
  totalPledged,
  fulfilledCount,
  partialCount,
  unfulfilledCount,
  loading,
}) {
  return (
    <Box mb={4}>
      <Typography
        variant="h4"
        mb={2}
      >
        Dashboard
      </Typography>
      <Grid
        container
        spacing={2}
      >
        <Grid 
          item 
          xs={12} 
          md={6}
        >
          <Paper sx={{ p:2 }}>
            <Typography variant="h5" fontWeight="bold">
                Total Pledges
            </Typography>
            {loading ? <CircularProgress /> : <Typography variant="h4">
                {totalPledgers}
            </Typography>}
          </Paper>
        </Grid>
        <Grid 
          item 
          xs={12} 
          md={6}
        >
          <Paper sx={{ p:2 }}>
            <Typography variant="h5" fontWeight="bold">
                Total Amount Pledged
            </Typography>
            {loading ? <CircularProgress /> : <Typography variant="h4">
                {formatCurrency(totalPledged)}
            </Typography>}
          </Paper>
        </Grid>
        <Grid 
          item 
          xs={12} 
          md={4}
        >
          <Paper sx={{ p:2 }}>
            <Typography variant="h5" fontWeight="bold">
                Fulfilled Pledges
            </Typography>
            {loading ? <CircularProgress /> : <Typography variant="h5">
                {fulfilledCount}
            </Typography>}
          </Paper>
        </Grid>
        <Grid 
          item 
          xs={12} 
          md={4}
        >
          <Paper sx={{ p:2 }}>
            <Typography variant="h5" fontWeight="bold">
                Partial Pledges
            </Typography>
            {loading ? <CircularProgress /> : <Typography variant="h5">
                {partialCount}
            </Typography>}
          </Paper>
        </Grid>
        <Grid 
          item 
          xs={12} 
          md={4}
        >
          <Paper sx={{ p:2 }}>
            <Typography variant="h5" fontWeight="bold">
                Unfulfilled Pledges
            </Typography>
            {loading ? <CircularProgress /> : <Typography variant="h5">
                {unfulfilledCount}
            </Typography>}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
