import pageConfig from '@/apis/pageConfig'
import category from '@/apis/category'

export const state = () => ({
  pageConfig: {
    index: {
      banner: [],
      services: [],
      categories: []
    }
  },
  changeOptions: {
    postion: '',
    _id: ''
  },
  categories: []
})

export const mutations = {
  SET_PAGE_CONFIG (state, pageConfig) {
    state.pageConfig = pageConfig || null
  },
  SET_CHANGE_OPTIONS (state, changeOptions) {
    state.changeOptions = changeOptions
  },
  SET_CATEGORIES (state, categories) {
    state.categories = categories
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
  },
  async setCategories ({ commit }) {
    const categories = await category.list({})
    commit('SET_CATEGORIES', categories)
  }
}

export const getters = {
  categories (state) {
    return state.pageConfig.index.categories
  },
  categoriesForList (state) {
    const categories = state.categories
    return categories
  }
}
