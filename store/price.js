import price from '@/apis/price'

export const state = () => ({
  priceList: [],
  dataTypes: [
    { value: 'number', label: '数字' },
    { value: 'string', label: '文字' }
    // { value: 'image', label: '图片' }
  ]
})

export const mutations = {
  SET_PRICE_LIST (state, priceList) {
    state.priceList = priceList
  }
}

export const actions = {
  async setPriceList ({ state, commit }) {
    if (!state.priceList.length) {
      const { rows } = await price.list({ sort: '-createdAt' })
      commit('SET_PRICE_LIST', rows)
    }
  }
}
