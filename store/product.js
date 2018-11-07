import product from '@/apis/product'

export const state = () => ({
  products: [],
  isEdit: false,
  editProductId: '',
  editProduct: {},
  count: 0
})

export const mutations = {
  SET_PRODUCTS (state, products) {
    state.products = products
  },
  SET_COUNT (state, count) {
    state.count = count
  },
  SET_IS_EDIT (state, isEdit) {
    state.isEdit = isEdit || false
  },
  SET_EDIT_PRODUCT_ID (state, editProductId) {
    state.editProductId = editProductId
  },
  SET_EDIT_PRODUCT (state, editProduct) {
    state.editProduct = editProduct
  }
}

export const actions = {
  async listProducts ({ commit }, { limit = 10, skip = 0 }) {
    const { rows, count } = await product.list({ limit, skip })
    commit('SET_PRODUCTS', rows)
    commit('SET_COUNT', count)
  },
  async setEditProduct ({ state, commit }) {
    const editProduct = await product.getById(state.editProductId)
    commit('SET_EDIT_PRODUCT', editProduct)
  }
}

export const getters = {
  imgs (state) {
    return state.editProduct.imgs
  },
  detailImgs (state) {
    return state.editProduct.detailImgs ? state.editProduct.detailImgs.product : []
  }
}
