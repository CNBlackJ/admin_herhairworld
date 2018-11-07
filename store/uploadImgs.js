import axios from 'axios'
import product from '@/apis/product'

export const state = () => ({
  detailImgs: [],
  imgs: [],
  newImgs: [],
  newDetailImgs: []
})

export const mutations = {
  SET_IMGS (state, imgs) {
    state.imgs = imgs
  },
  STE_DETAIL_IMGS (state, detailImgs) {
    state.detailImgs = detailImgs
  },
  SET_NEW_IMGS (state, newImgs) {
    state.newImgs = newImgs
  },
  STE_NEW_DETAIL_IMGS (state, newDetailImgs) {
    state.newDetailImgs = newDetailImgs
  }
}

export const actions = {
  async setFiles ({ commit }, imgUrl) {
    commit('SET_IMG_URL', imgUrl)
  },
  async uploadImgs ({ commit, rootState }, { formData, config, type }) {
    const resp = (await axios.post(rootState.apiUrl + '/api/qiniu/upload', formData, config)).data
    const files = resp.data
    if (type === 'details') {
      commit('STE_DETAIL_IMGS', files)
    } else if (type === 'products') {
      commit('SET_IMGS', files)
    }
  },
  async updateProduct ({ state, rootState }, type) {
    const editProductId = rootState.product.editProductId
    const isEdit = rootState.product.isEdit
    if (isEdit) {
      const payload = {
        _id: editProductId
      }
      if (type === 'details') {
        Object.assign(payload, { detailImgs: { product: [...state.detailImgs, ...state.newDetailImgs] } })
      } else if (type === 'products') {
        Object.assign(payload, { imgs: [...state.imgs, ...state.newImgs] })
      }
      await product.update({ prod: payload })
    }
  },
  async updateProductImgIndex ({ state, rootState }, { type, imgList }) {
    const editProductId = rootState.product.editProductId
    const payload = { _id: editProductId }
    if (type === 'details') {
      Object.assign(payload, { detailImgs: { product: imgList } })
    } else if (type === 'products') {
      Object.assign(payload, { imgs: imgList })
    }
    await product.update({ prod: payload })
  }
}
