import { getUserJwtFromCookie, getUserJwtFromLocalStorage } from '~/utils/auth'

export default function ({ store, req, redirect }) {
   // If nuxt generate, pass this middleware
  const isServer = process.server
  if (isServer && !req) return
  const adminToken = isServer ? getUserJwtFromCookie(req) : getUserJwtFromLocalStorage()
  if (adminToken && !store.getters.isAuthenticated) {
    // login with token
    store.dispatch('loginWithToken', adminToken)
  }
  if (!adminToken && !store.getters.isAuthenticated) redirect('/login')
}
