
export const state = () => ({
  imgUrl: '',
  isShow: false
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
  setImgUrl ({ commit }, imgUrl) {
    commit('SET_IMG_URL', imgUrl)
  }
}
