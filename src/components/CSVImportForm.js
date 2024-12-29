import React, { useState } from 'react'
import {
  Box,
  Button,
  Typography
} from '@mui/material'

export default function CSVImportForm({
    onImport,
    loading,
}) {
  const [file, setFile] = useState(null)

  const handleImport = (e) => {
    e.preventDefault()
    if (file) onImport(file)
  }

  return (
    <Box
      component="form"
      onSubmit={handleImport}
      display="flex"
      flexDirection={{
        xs:'column',
        sm:'row',
      }}
      alignItems={{
        xs:'flex-start',
        sm:'center',
      }}
      gap={2}
      mt={2}
      mb={2}
    >
      <Button
        variant="contained"
        component="label"
        disabled={loading}
      >
        Select CSV
        <input
          type="file"
          accept=".csv"
          hidden
          onChange={e=>setFile(e.target.files[0])}
        />
      </Button>
      {
        file && (
          <Typography variant="body1">
            {file.name}
          </Typography>
        )
      }
      <Button
        variant="contained"
        type="submit"
        disabled={!file}
      >
        Import
      </Button>
    </Box>
  )
}
