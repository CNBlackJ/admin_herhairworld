import * as axios from 'axios'

const baseURL = {
  production: 'http://api.herhairworld.com',
  staging: 'http://apiherhairworld.wifihi.cn',
  development: 'http://127.0.0.1:3010'
}

export default ({ app, store, redirect }) => {
  const BASE_URL = require('~/config.json').BASE_URL
  axios.defaults.baseURL = BASE_URL || baseURL[process.env.NODE_ENV] || baseURL['staging']

  axios.interceptors.request.use(req => {
    let authToken = ''
    if (!process.server) {
      authToken = window.localStorage.getItem('adminToken')
    } else {
      authToken = store.state.adminToken
    }
    if (authToken) {
      req.headers.Authorization = `Bearer ${authToken}`
    }
    return req
  }, err => {
    return Promise.reject(err)
  })

  axios.interceptors.response.use(response => {
    return response
  }, function (error) {
    if (error.response.status === 401) {
      redirect('/login')
    }
    return Promise.reject(error.response)
  })
}
