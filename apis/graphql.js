import request from './request'

export default class graphql {
  static async query (query) {
    const results = (await request.get(`/public/graphql?query=${query}`)).data
    return results.data
  }
}
