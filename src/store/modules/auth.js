import Vue from 'vue'

const init_state = () => {
  return {
    isLoggedIn: false
  }
}

const mutations = {
  SET_TOKEN (state, payload) {
    state.isLoggedIn = true
    localStorage.setItem('auth_token', payload.access_token)
  },

  SET_LOGIN_STATE (state, payload) {
    state.isLoggedIn = payload
  },

  LOGOUT (state) {
    state.isLoggedIn = false
    localStorage.removeItem('auth_token')
  }
}

const actions = {
  login({ commit }, payload) {
    return Vue.axios.post('login', payload).then((res) => {
      commit('SET_TOKEN', res.data)
      return Vue.axios.get('me').then((res) => {
        commit('user/SET_USER', res.data, { root: true })
        return res.data
      })
    })
  },

  signup({ commit }, payload) {
    return Vue.axios.post('signup', payload).then((res) => {
      commit('SET_TOKEN', res.data)
      return Vue.axios.get('me').then((res) => {
        commit('user/SET_USER', res.data, { root: true })
        return res.data
      })
    })
  },

  logout({ commit }) {
    commit('LOGOUT')
  },

}

export default {
  namespaced: true,
  state: init_state(),
  mutations,
  actions
}
