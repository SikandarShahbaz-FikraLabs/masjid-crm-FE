import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

export const getPledgers = (params) =>
  axios.get(`${API_URL}/pledgers`, { params })

export const getPledger = (id) =>
  axios.get(`${API_URL}/pledgers/${id}`)

export const updatePledger = (id, data) =>
  axios.put(`${API_URL}/pledgers/${id}`, data)

export const getContacts = (pledgerId) =>
  axios.get(`${API_URL}/contacts/${pledgerId}`)

export const addContact = (data) =>
  axios.post(`${API_URL}/contacts`, data)

export const getPayments = (pledgerId) =>
  axios.get(`${API_URL}/payments/${pledgerId}`)

export const addPayment = (data) =>
  axios.post(`${API_URL}/payments`, data)

export const importPledgers = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return axios.post(`${API_URL}/pledgers/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
