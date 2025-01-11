import React, { useEffect, useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Button,
} from '@mui/material'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import { formatCurrency } from '../utils/formatters'
import { getDashboardData } from '../services/api'
import { Link } from 'react-router-dom'

export default function DashboardStats() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getDashboardData()
      setData(res.data)
    } catch {
      setData(null)
    }
    setLoading(false)
  }

  if (loading && !data) {
    return (
      <Box mb={4} textAlign="center">
        <CircularProgress />
      </Box>
    )
  }

  if (!data) {
    return (
      <Box mb={4}>
        <Typography variant="body1">No dashboard data</Typography>
      </Box>
    )
  }

  const {
    totalDonationsThisMonth,
    yearToDateDonations,
    pledgeFulfillmentRate,
    outstandingPledges,
    topDonors,
    activeDonorsCount,
    hndContributions,
    monthlyTrend,
    donorRanges
  } = data

  const colorPie = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042']
  const pieData = [
    { name: '< $100', value: donorRanges.lt100 },
    { name: '$100-$500', value: donorRanges.between100_500 },
    { name: '$500-$1000', value: donorRanges.between500_1000 },
    { name: '> $1000', value: donorRanges.gt1000 }
  ]

  return (
    <Box mb={4}>
      <Typography variant="h4" mb={2}>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p:2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Total Donations This Month
            </Typography>
            <Typography variant="h5" sx={{ mt:1 }}>
              {formatCurrency(totalDonationsThisMonth)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p:2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Year-to-Date Donations
            </Typography>
            <Typography variant="h5" sx={{ mt:1 }}>
              {formatCurrency(yearToDateDonations)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p:2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Active Donors (30d)
            </Typography>
            <Typography variant="h5" sx={{ mt:1 }}>
              {activeDonorsCount}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt:2 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p:2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Pledge Fulfillment Rate
            </Typography>
            <Typography variant="h5" color="primary" sx={{ mt:1 }}>
              {pledgeFulfillmentRate.toFixed(2)}%
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p:2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Outstanding Pledges
            </Typography>
            <Typography variant="h5" sx={{ mt:1 }}>
              {formatCurrency(outstandingPledges)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p:2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              High-Net-Worth (HnD) Contributions
            </Typography>
            <Typography variant="h5" sx={{ mt:1 }}>
              {formatCurrency(hndContributions)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt:2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p:2 }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              Donations by Month (Last 12)
            </Typography>
            <LineChart width={400} height={200} data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#8884d8" />
            </LineChart>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p:2 }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              Donors by Contribution Range
            </Typography>
            <PieChart width={400} height={200}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={colorPie[index % colorPie.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mt:4, mb:2 }}>
        Top Donors (Last 90 days)
      </Typography>
      <Paper sx={{ p:2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topDonors.map((d, idx) => (
              <TableRow key={idx}>
                <TableCell>{d.name}</TableCell>
                <TableCell>{formatCurrency(d.total)}</TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/pledgers/${d.pledgerId}`}
                    variant="outlined"
                    size="small"
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}
