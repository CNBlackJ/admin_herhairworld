// import pageConfig from '@/apis/pageConfig'

export const state = () => ({
  isShow: false,
  imgUrl: ''
})

export const mutations = {
  SET_IS_SHOW (state) {
    state.isShow = !state.isShow
  },
  SET_IMG_URL (state, imgUrl) {
    state.imgUrl = imgUrl
  }
}

export const actions = {
  async setImgUrl ({ commit }, imgUrl) {
    commit('SET_IMG_URL', imgUrl)
  }
}
