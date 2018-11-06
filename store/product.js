import product from '@/apis/product'

export const state = () => ({
  products: [],
  isEdit: false,
  editProductId: '',
  editProduct: {}
})

export const mutations = {
  SET_PRODUCTS (state, products) {
    state.products = products
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
  async listProducts ({ commit }) {
    const products = await product.list({})
    commit('SET_PRODUCTS', products)
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
