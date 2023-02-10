import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage'

Vue.use(Vuex)

const TONKEN_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
  state: {
    // user: JSON.parse(localStorage.getItem(TONKEN_KEY))
    // user: null // 用来存储用户登录数据（token）
    user: getItem(TONKEN_KEY)
  },
  getters: {
  },
  mutations: {
    setUser (state, data) {
      state.user = data

      // 为了防止刷新， 数据持久化
      // localStorage.setItem(TONKEN_KEY, JSON.stringify(state.user))
      setItem(TONKEN_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
