import request from './request'

export default class price {
  static async create (price) {
    const resp = (await request.post('/api/prices', price)).data
    let result = ''
    if (!resp.error_code) result = resp.data
    return result
  }

  static async list ({ limit, skip, sort }) {
    const queryStr = `?limit=${limit || 20}&skip=${skip || 0}&sort=${sort || '-createdAt'}`
    const resp = (await request.get(`/api/prices${queryStr}`)).data
    let results = {}
    if (!resp.error_code) results = resp.data
    return results
  }

  static async update (price) {
    const id = price._id
    delete price._id
    delete price.createdAt
    delete price.updatedAt
    delete price.isDeleted
    delete price.__v
    const resp = (await request.put(`/api/prices/${id}`, price)).data
    let result = ''
    if (!resp.error_code) result = resp.data
    return result
  }

  static async delete (_id) {
    const resp = (await request.delete(`/api/prices/${_id}`)).data
    let result = ''
    if (!resp.error_code) result = resp.data
    return result
  }
}
