import category from '@/apis/category'

export const state = () => ({
  categories: []
})

export const mutations = {
  SET_CATEGORIES (state, categories) {
    state.categories = categories || []
  }
}

export const actions = {
  async setCategories ({ commit }, { sort, skip, limit }) {
    const categories = await category.list({})
    commit('SET_CATEGORIES', categories)
  }
}
