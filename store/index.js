import adminUser from '@/apis/adminUser'
import LS from '@/apis/localStorage'

export const state = () => ({
  user: null,
  apiUrl: process.env.NODE_ENV === 'production' ? 'http://47.90.207.98:3010' : 'http://localhost:3010'
})

export const mutations = {
  SET_USER (state, user) {
    state.user = user || null
  }
}

export const actions = {
  isAuthenticated (state) {
    return !!state.user
  },
  loggedUser (state) {
    return state.user
  },
  async login ({ commit }, user) {
    const loggedUser = await adminUser.login(user)
    if (loggedUser) {
      commit('SET_USER', loggedUser)
      LS.setVal('adminToken', loggedUser.authToken)
      this.$cookies.set('adminToken', loggedUser.authToken)
    }
  },
  async loginWithToken ({ commit }, adminToken) {
    const loggedUser = await adminUser.authWithToken(adminToken)
    commit('SET_USER', loggedUser)
  }
}

export const getters = {
  isAuthenticated (state) {
    return !!state.user
  },
  loggedUser (state) {
    return state.user
  }
}
