// import Vue from 'vue'
import { AXIOS } from '../../services/ApiService';

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
    // localStorage.removeItem('vuex')
    // console.log('sdds');
  }
}

const actions = {
  login({ commit }, payload) {
    return AXIOS.post('login', payload).then((res) => {
      commit('SET_TOKEN', res.data)
      return AXIOS.get('me').then((res) => {
        commit('user/SET_USER', res.data, { root: true })
        return res.data
      })
    })
  },

  signup({ commit }, payload) {
    return AXIOS.post('signup', payload).then((res) => {
      commit('SET_TOKEN', res.data)
      return AXIOS.get('me').then((res) => {
        commit('user/SET_USER', res.data, { root: true })
        return res.data
      })
    })
  },

  logout({ commit }) {
    commit('LOGOUT')
    commit('campaign/CLEAR_STATE', null, { root: true });
  },

}

export default {
  namespaced: true,
  state: init_state(),
  mutations,
  actions
}
