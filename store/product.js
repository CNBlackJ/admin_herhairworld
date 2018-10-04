import product from '@/apis/product'

export const state = () => ({
  products: []
})

export const mutations = {
  SET_PRODUCTS (state, products) {
    state.products = products
  }
}

export const actions = {
  async listProducts ({ commit }) {
    const products = await product.list({})
    commit('SET_PRODUCTS', products)
  }
}
