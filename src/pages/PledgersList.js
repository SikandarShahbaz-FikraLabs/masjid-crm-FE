import React, { useEffect, useState } from 'react'
import { getPledgers, importPledgers } from '../services/api'
import PledgersTable from '../components/PledgersTable'
import { Box, TextField, Typography, Button } from '@mui/material'
import Loader from '../components/Loader'
import Notification from '../components/Notification'

export default function PledgersList() {
  const [pledgers, setPledgers] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [filters, setFilters] = useState({ name: '', email: '', phone: '' })
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [loading, setLoading] = useState(false)
  const [notif, setNotif] = useState({ open:false, message:'', severity:'info' })

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
    } catch {
      setNotif({ open:true, message:'Failed to load pledgers', severity:'error' })
    }
    setLoading(false)
  }

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Pledgers
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
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
      </Box>
      {loading ? <Loader /> : <PledgersTable pledgers={pledgers} />}
      <Box mt={2} display="flex" justifyContent="center" alignItems="center" gap={2}>
        <Button
          variant="outlined"
          onClick={()=>setPage(page>1?page-1:1)}
          disabled={page===1||loading}
        >
          Prev
        </Button>
        <Typography>Page {page} of {totalPages}</Typography>
        <Button
          variant="outlined"
          onClick={()=>setPage(page<totalPages?page+1:page)}
          disabled={page===totalPages||totalPages===0||loading}
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
