import request from './request'

export default class product {
  static async create (prod) {
    const resp = await request.post('/api/products', prod)
    return resp.data
  }

  static async list ({ limit, skip, sort, categoryId }) {
    const categoryIdStr = categoryId ? `&categoryId=${categoryId}` : ''
    const queryStr = `?limit=${limit || 20}&skip=${skip || 0}&sort=${sort || 'index'}${categoryIdStr}`
    const resp = (await request.get(`/api/products${queryStr}`)).data
    let results = []
    if (!resp.error_code) results = resp.data
    return results
  }

  static async search ({ limit, skip, sort, categoryId, minPrice, maxPrice, stock, search }) {
    const categoryIdStr = categoryId ? `&categoryId=${categoryId}` : ''
    const searchStr = search ? `&search=${search}` : ''
    const queryStr = `?limit=${limit || 20}&skip=${skip || 0}&sort=${sort || 'index'}&stock=${stock}&minPrice=${minPrice}&maxPrice=${maxPrice}${categoryIdStr}${searchStr}`
    const resp = (await request.get(`/api/products${queryStr}`)).data
    let results = []
    if (!resp.error_code) results = resp.data
    return results
  }
  static async getByIds ({ productIds }) {
    const resp = (await request.post('/api/products/getByIds', { productIds })).data
    let results = []
    if (!resp.error_code) results = resp.data
    return results
  }

  static async getById (productId) {
    const resp = (await request.get(`/api/products/${productId}`)).data
    let results = []
    if (!resp.error_code) results = resp.data
    return results
  }

  static async update ({ prod }) {
    const id = prod._id
    delete prod._id
    delete prod.createdAt
    delete prod.updatedAt
    delete prod.isDeleted
    delete prod.__v
    delete prod.sales
    delete prod.minLen
    delete prod.maxLen
    const resp = await request.put(`/api/products/${id}`, prod)
    return resp.data
  }

  static async updateSort (payload) {
    const resp = (await request.post('/api/products/sort', payload)).data
    let result = ''
    if (!resp.error_code) result = resp.data
    return result
  }

  static async deleteById ({ id }) {
    const resp = await request.delete(`api/products/${id}`)
    return resp.data
  }
}
