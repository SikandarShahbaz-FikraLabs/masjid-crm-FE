import React, { useEffect, useState, useRef } from 'react'
import { getPledges, importPledgers } from '../services/api'
import PledgesTable from '../components/PledgesTable'
import CSVImportForm from '../components/CSVImportForm'
import DashboardStats from '../components/DashboardStats'
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Typography,
  Button
} from '@mui/material'
import Loader from '../components/Loader'
import Notification from '../components/Notification'

export default function PledgesList() {
  const [filters, setFilters] = useState({
    pledgerName: '',
    pledgerEmail: '',
    pledgerPhone: '',
    status: ''
  })
  const [localFilters, setLocalFilters] = useState(filters)
  const debounceTimer = useRef(null)
  const [pledges, setPledges] = useState([])
  const [stats, setStats] = useState({
    totalPledgers: 0,
    totalPledged: 0,
    fulfilledCount: 0,
    partialCount: 0,
    unfulfilledCount: 0
  })
  const [totalPledgers, setTotalPledgers] = useState(0)
  const [page, setPage] = useState(1)
  const limit = 10
  const [loading, setLoading] = useState(false)
  const [notif, setNotif] = useState({
    open:false,
    message:'',
    severity:'info'
  })
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    loadPledges()
  }, [filters, page])

  // Debounce user input so we don't call the API on every keystroke
  useEffect(() => {
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      setFilters({ ...localFilters })
      setPage(1)
    }, 500)
    return () => clearTimeout(debounceTimer.current)
  }, [localFilters])

  const loadPledges = async () => {
    setLoading(true)
    try {
      const params = { page, limit }
      if (filters.pledgerName)  params.pledgerName  = filters.pledgerName
      if (filters.pledgerEmail) params.pledgerEmail = filters.pledgerEmail
      if (filters.pledgerPhone) params.pledgerPhone = filters.pledgerPhone
      if (filters.status)       params.status       = filters.status

      const res = await getPledges(params)
      console.log(res)
      setPledges(res.data.pledges)
      setTotalCount(res.data.totalCount)
      setStats(res.data.stats)
      setTotalPledgers(res.data.stats.totalPledgers || 0)
    } catch {
      setNotif({
        open:true,
        message:'Failed to load pledges',
        severity:'error'
      })
    }
    setLoading(false)
  }

  const handleImport = async (file) => {
    setLoading(true)
    try {
      const res = await importPledgers(file)
      setNotif({
        open:true,
        message: `Inserted ${res.data.insertedCount} pledgers`,
        severity: 'success'
      })
      loadPledges()
    } catch {
      setNotif({
        open:true,
        message:'Failed to import pledgers',
        severity:'error'
      })
    }
    setLoading(false)
  }

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <Box>
      <DashboardStats
        totalPledgers={totalPledgers}
        totalPledged={stats.totalPledged}
        fulfilledCount={stats.fulfilledCount}
        partialCount={stats.partialCount}
        unfulfilledCount={stats.unfulfilledCount}
        loading={loading}
      />
      <Typography variant="h5" mb={2}>
        Pledges
      </Typography>
      <CSVImportForm onImport={handleImport} loading={loading} />
      <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
        <TextField
          label="Pledger Name"
          value={localFilters.pledgerName}
          onChange={e => setLocalFilters({ ...localFilters, pledgerName: e.target.value })}
          disabled={loading}
        />
        <TextField
          label="Pledger Email"
          value={localFilters.pledgerEmail}
          onChange={e => setLocalFilters({ ...localFilters, pledgerEmail: e.target.value })}
          disabled={loading}
        />
        <Select
          value={localFilters.status}
          onChange={e => setLocalFilters({ ...localFilters, status: e.target.value })}
          displayEmpty
          disabled={loading}
        >
          <MenuItem value="">
            <em>All Status</em>
          </MenuItem>
          <MenuItem value="unfulfilled">Unfulfilled</MenuItem>
          <MenuItem value="partial">Partial</MenuItem>
          <MenuItem value="fulfilled">Fulfilled</MenuItem>
        </Select>
      </Box>
      {loading ? <Loader /> : <PledgesTable pledges={pledges} />}
      <Box mt={2} display="flex" justifyContent="center" alignItems="center" gap={2}>
        <Button
          variant="outlined"
          onClick={() => setPage(page > 1 ? page - 1 : 1)}
          disabled={page === 1 || loading}
        >
          Prev
        </Button>
        <Typography>
          Page {page} of {totalPages}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setPage(page < totalPages ? page + 1 : page)}
          disabled={page === totalPages || totalPages === 0 || loading}
        >
          Next
        </Button>
      </Box>
      <Notification
        open={notif.open}
        message={notif.message}
        severity={notif.severity}
        onClose={() => setNotif({ ...notif, open:false })}
      />
    </Box>
  )
}
