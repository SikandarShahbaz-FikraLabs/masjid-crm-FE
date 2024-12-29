import React, {
  useEffect,
  useState,
} from 'react'
import {
  getPledgers,
  importPledgers
} from '../services/api'
import PledgersTable from '../components/PledgersTable'
import CSVImportForm from '../components/CSVImportForm'
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
import DashboardStats from '../components/DashboardStats'

export default function PledgersList() {
  const [pledgers, setPledgers] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [stats, setStats] = useState({
    totalPledged: 0,
    fulfilledCount: 0,
    partialCount: 0,
    unfulfilledCount: 0
  })
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    phone: '',
    status: ''
  })
  const [page, setPage] = useState(1)
  const limit = 10
  const totalPages = Math.ceil(totalCount / limit)
  const [loading, setLoading] = useState(false)
  const [notif, setNotif] = useState({
    open:false,
    message:'',
    severity:'info'
  })

  useEffect(() => {
    loadPledgers()
  }, [filters, page])

  const loadPledgers = async () => {
    setLoading(true)
    try {
      const res = await getPledgers({
        ...filters,
        page,
        limit
      })
      setPledgers(res.data.pledgers)
      setTotalCount(res.data.totalCount)
      setStats(res.data.stats)
    } catch {
      setNotif({
        open: true,
        message: 'Failed to load pledgers',
        severity: 'error',
      })
    }
    setLoading(false)
  }

  const handleImport = async (file) => {
    setLoading(true)
    try {
      const res = await importPledgers(file)
      setNotif({
        open: true,
        message: `Inserted ${res.data.insertedCount} pledgers`,
        severity: 'success',
      })
      loadPledgers()
    } catch {
      setNotif({
        open: true,
        message: 'Failed to import pledgers',
        severity: 'error',
      })
      setLoading(false)
    }
  }

  return (
    <Box>
      <DashboardStats
        totalPledgers={totalCount}
        totalPledged={stats.totalPledged}
        fulfilledCount={stats.fulfilledCount}
        partialCount={stats.partialCount}
        unfulfilledCount={stats.unfulfilledCount}
        loading={loading}
      />

      <CSVImportForm
        onImport={handleImport}
        loading={loading}
      />

      <Typography
        variant="h5"
        mb={2}
        mt={4}
      >
        Pledgers
      </Typography>

      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        mb={2}
      >
        <TextField
          label="Name"
          value={filters.name}
          onChange={e=>setFilters({...filters,name:e.target.value})}
          disabled={loading}
        />
        <TextField
          label="Email"
          value={filters.email}
          onChange={e=>setFilters({...filters,email:e.target.value})}
          disabled={loading}
        />
        <TextField
          label="Phone"
          value={filters.phone}
          onChange={e=>setFilters({...filters,phone:e.target.value})}
          disabled={loading}
        />
        <Select
          value={filters.status}
          onChange={e=>setFilters({...filters,status:e.target.value})}
          displayEmpty
          disabled={loading}
        >
          <MenuItem value="">
            <em>ALL</em>
          </MenuItem>
          <MenuItem value="unfulfilled">UNFULFILLED</MenuItem>
          <MenuItem value="partial">PARTIAL</MenuItem>
          <MenuItem value="fulfilled">FULFILLED</MenuItem>
        </Select>
      </Box>

      {
        loading ? 
        <Loader /> : 
        <PledgersTable pledgers={pledgers} />
      }

      <Box
        mt={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        <Button
          variant="outlined"
          onClick={()=>setPage(page>1?page-1:1)}
          disabled={page === 1 || loading}
        >
          Prev
        </Button>
        <Typography>
          Page {page} of {totalPages}
        </Typography>
        <Button
          variant="outlined"
          onClick={()=>setPage(page<totalPages?page+1:page)}
          disabled={page === totalPages || totalPages === 0 || loading}
        >
          Next
        </Button>
      </Box>

      <Notification
        open={notif.open}
        message={notif.message}
        severity={notif.severity}
        onClose={()=>setNotif({...notif,open:false})}
      />
    </Box>
  )
}
