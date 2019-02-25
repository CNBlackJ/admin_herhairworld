import order from '@/apis/order'

export const state = () => ({
  orders: [],
  count: 0,
  orderList: [],
  orderData: {},
  orderSummary: {}
})

export const mutations = {
  SET_ORDERS (state, orders) {
    state.orders = orders || []
  },
  SET_COUNT (state, count) {
    state.count = count || 0
  },
  SET_ORDER_SUMMARY (state, orderSummary) {
    state.orderSummary = orderSummary
  }
}

export const actions = {
  async setOrders ({ commit }, { sort = '-createdAt', limit = 10, skip = 0 }) {
    const { rows, count } = await order.list({ sort, limit, skip })
    commit('SET_ORDERS', rows)
    commit('SET_COUNT', count)
  },
  async getOrderSummary ({ commit }) {
    const orderSummary = await order.summary()
    commit('SET_ORDER_SUMMARY', orderSummary)
    return orderSummary
  }
}

export const getters = {
  orderDetails (state) {
    const orders = state.orders
    return orders.map(ele => {
      let payerInfo = {}
      const paymentInfo = ele.paymentInfo ? JSON.parse(ele.paymentInfo) : null
      if (paymentInfo && paymentInfo.payer && paymentInfo.payer.payer_info) {
        payerInfo = paymentInfo.payer.payer_info
      }
      ele.email = payerInfo.email
      ele.mobile = payerInfo.phone
      return ele
    })
  }
}
