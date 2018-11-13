import request from './request'

export default class payment {
  static async create (payment) {
    const resp = (await request.post('/api/payments', payment)).data
    let result = ''
    if (!resp.error_code) result = resp.data
    return result
  }

  static async list ({ limit, skip, sort }) {
    const queryStr = `?limit=${limit || 20}&skip=${skip || 0}&sort=${sort || '-createdAt'}`
    const resp = (await request.get(`/api/payments${queryStr}`)).data
    let results = []
    if (!resp.error_code) results = resp.data
    return results
  }

  static async update (payment) {
    const id = payment._id
    delete payment._id
    delete payment.createdAt
    delete payment.updatedAt
    delete payment.isDeleted
    delete payment.__v
    const resp = (await request.put(`/api/payments/${id}`, payment)).data
    let result = ''
    if (!resp.error_code) result = resp.data
    return result
  }

  static async delete (_id) {
    const resp = (await request.delete(`/api/payments/${_id}`)).data
    let result = ''
    if (!resp.error_code) result = resp.data
    return result
  }
}
