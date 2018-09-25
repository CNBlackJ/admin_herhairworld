import pageConfig from '@/apis/pageConfig'

export const state = () => ({
  pageConfig: {
    index: {
      banner: [],
      services: []
    }
  },
  changeOptions: {
    postion: '',
    _id: ''
  }
})

export const mutations = {
  SET_PAGE_CONFIG (state, pageConfig) {
    state.pageConfig = pageConfig || null
  },
  SET_CHANGE_OPTIONS (state, changeOptions) {
    state.changeOptions = changeOptions
  }
}

export const actions = {
  async setPageConfig ({ commit }) {
    const page = await pageConfig.list({ sort: '-createdAt' })
    commit('SET_PAGE_CONFIG', page[0])
  },
  async updatePageConfig ({ commit }, page) {
    const updatedPage = await pageConfig.update(page)
    commit('SET_PAGE_CONFIG', updatedPage)
  },
  async setChangeOptions ({ commit }, changeOptions) {
    commit('SET_CHANGE_OPTIONS', changeOptions)
  }
}
