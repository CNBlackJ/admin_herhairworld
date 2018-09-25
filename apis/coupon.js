import request from './request'

export default class coupon {
  static async create ({ coupon }) {
    const resp = (await request.post('/api/coupons', coupon)).data
    let result = ''
    if (!resp.error_code) result = resp.data
    return result
  }

  static async list ({ limit, skip, sort }) {
    const queryStr = `?limit=${limit || 20}&skip=${skip || 0}&sort=${sort || '-createdAt'}`
    const resp = (await request.get(`/api/coupons${queryStr}`)).data
    let results = []
    if (!resp.error_code) results = resp.data
    return results
  }

  static async update ({ coupon }) {
    const id = coupon._id
    delete coupon._id
    delete coupon.createdAt
    delete coupon.updatedAt
    delete coupon.isDeleted
    delete coupon.__v
    delete coupon.code
    delete coupon.surplus
    const resp = (await request.put(`/api/coupons/${id}`, coupon)).data
    let result = ''
    if (!resp.error_code) result = resp.data
    return result
  }

  static async delete (_id) {
    const resp = (await request.delete(`/api/coupons/${_id}`)).data
    let result = ''
    if (!resp.error_code) result = resp.data
    return result
  }
}
