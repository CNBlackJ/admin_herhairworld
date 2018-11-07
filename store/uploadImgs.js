import product from '@/apis/product'

export const state = () => ({
  detailImgs: [],
  imgs: []
})

export const mutations = {
  SET_IMGS (state, imgs) {
    state.imgs = imgs
  },
  STE_DETAIL_IMGS (state, detailImgs) {
    state.detailImgs = detailImgs
  }
}

export const actions = {
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
  },
  pushIntoImgs ({ state, commit }, imgFile) {
    const imgs = JSON.parse(JSON.stringify(state.imgs))
    imgs.push(imgFile)
    commit('SET_IMGS', imgs)
  },
  pushIntoDetailImgs ({ state, commit }, imgFile) {
    const detailImgs = JSON.parse(JSON.stringify(state.detailImgs))
    detailImgs.push(imgFile)
    commit('STE_DETAIL_IMGS', detailImgs)
  }
}
