import React from 'react'
import {
  Snackbar,
  Alert,
} from '@mui/material'

export default function Notification({
  open,
  onClose,
  message,
  severity,
  autoHideDuration
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical:'top', horizontal:'center' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ width:'100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}
