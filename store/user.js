import adminUser from '@/apis/adminUser'

export const state = () => ({
  adminUserList: []
})

export const mutations = {
  SET_ADMIN_USER_LIST (state, adminUserList) {
    state.adminUserList = adminUserList
  }
}

export const actions = {
  async setAdminUserList ({ commit }) {
    const { rows } = await adminUser.list({ sort: '-createdAt' })
    commit('SET_ADMIN_USER_LIST', rows)
  },
  async updateAdminUser ({ state }, payload) {
    await adminUser.update(payload)
  }
}
