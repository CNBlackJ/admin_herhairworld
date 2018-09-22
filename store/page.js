import pageConfig from '@/apis/pageConfig'

export const state = () => ({
  pageConfig: null
})

export const mutations = {
  SET_PAGE_CONFIG (state, pageConfig) {
    state.pageConfig = pageConfig || null
  }
}

export const actions = {
  async setPageConfig ({ commit }) {
    const page = await pageConfig.list({ sort: '-createdAt' })
    commit('SET_PAGE_CONFIG', page[0])
  }
}
