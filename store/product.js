import product from '@/apis/product'

export const state = () => ({
  products: [],
  isEdit: false,
  editProductId: '',
  editProduct: {},
  count: 0,
  isSort: false
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
  },
  SET_IS_SORT (state, isSort) {
    state.isSort = isSort
  }
}

export const actions = {
  async listProducts ({ commit }, { limit = 10, skip = 0, categoryId }) {
    const { rows, count } = await product.list({ limit, skip, categoryId })
    commit('SET_PRODUCTS', rows)
    commit('SET_COUNT', count)
  },
  async searchProducts ({ commit }, { limit = 10, skip = 0, categoryId, minPrice, maxPrice, stock, name }) {
    const { rows, count } = await product.search({
      limit,
      skip,
      categoryId,
      minPrice,
      maxPrice,
      stock,
      search: name
    })
    commit('SET_PRODUCTS', rows)
    commit('SET_COUNT', count)
  },
  setEditProduct ({ state, commit }) {
    const editProduct = state.products.find(ele => String(ele._id) === String(state.editProductId))
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
