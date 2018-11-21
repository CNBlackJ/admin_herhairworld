import md5 from 'md5'

import request from './request'

export default class user {
  static async getAdminUser (_id) {
    const resp = await request.get(`/api/adminUsers/${_id}`)
    return resp.data
  }

  static async list ({ limit, skip, sort }) {
    const queryStr = `?limit=${limit || 20}&skip=${skip || 0}&sort=${sort || '-createdAt'}`
    const resp = (await request.get(`/api/adminUsers${queryStr}`)).data
    let results = []
    if (!resp.error_code) results = resp.data
    return results
  }

  static async create (adminUser) {
    delete adminUser.pwConfirm
    adminUser.password = md5(adminUser.password)
    const resp = await request.post('/api/adminUsers', adminUser)
    return resp.data
  }

  static async update (adminUser) {
    const id = adminUser._id
    delete adminUser._id
    delete adminUser.createdAt
    delete adminUser.updatedAt
    delete adminUser.isDeleted
    delete adminUser.__v
    const resp = await request.put(`/api/adminUsers/${id}`, adminUser)
    return resp.data
  }

  static async login ({ username, password }) {
    const resp = (await request.post('/api/adminUsers/login', { username, password: md5(password) })).data
    let user = null
    if (!resp.error_code) user = resp.data
    return user
  }

  static async authWithToken (adminToken) {
    const resp = (await request.post('/api/adminUsers/authWithToken', { adminToken })).data
    let user = null
    if (!resp.error_code) user = resp.data
    return user
  }
}
