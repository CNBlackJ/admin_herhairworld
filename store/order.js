import order from '@/apis/order'

export const state = () => ({
  orders: []
})

export const mutations = {
  SET_ORDERS (state, orders) {
    state.orders = orders || []
  }
}

export const actions = {
  async setOrders ({ commit }) {
    const orders = await order.list({ sort: '-createdAt' })
    commit('SET_ORDERS', orders)
  }
}
