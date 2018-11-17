import price from '@/apis/price'

export const state = () => ({
  priceList: []
})

export const mutations = {
  SET_PRICE_LIST (state, priceList) {
    state.priceList = priceList
  }
}

export const actions = {
  async setPriceList ({ commit }) {
    const { rows } = await price.list({ sort: '-createdAt' })
    commit('SET_PRICE_LIST', rows)
  }
}
