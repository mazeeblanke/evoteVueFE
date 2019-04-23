import Vue from 'vue'
import { AXIOS } from '../../services/ApiService';

const init_state = () => {
    return {
       dashboard: {}
        // user: {},
        // loadingMe: false,
        // users: {data: []}
    }
}

// const getters = () => {
//   return {
//     userHasAdminRole(state) {
//       return state.user.roles && state.user.roles.filter(u => u.name === 'admin').length > 0
//     }
//   }
// }

const mutations = {
    SET_DASHBOARD (state, payload) {
        state.dashboard = payload
    },

    // SET_USERS (state, payload) {
    //     state.users = payload
    // },

    // UPDATE_USER (state, {data}) {
    //   let foundUserIndex = state.users.data.findIndex((user) => user.id === data.id)
    //   if (foundUserIndex > -1) {
    //     Vue.set(state.users.data, foundUserIndex, data)
    //   }
    // }
}

const actions = {
    loadDashboard ({ commit }) {
        return AXIOS.get('dashboard').then((res) => {
          commit('SET_DASHBOARD', res.data)
          // return res.data
        })
    },

    // updateUser ({ commit }, payload) {
    //   return AXIOS.patch(`users/${payload.id}`, payload).then((res) => {
    //     if (!payload.isAdminAction) {
    //       commit('SET_USER', res.data.data)
    //     }
    //     commit('UPDATE_USER', res.data)
    //     return res.data
    //   })
    // },

    // verifyUser ({ commit }, payload) {
    //   return AXIOS.patch('verifyUser', payload).then((res) => {
    //     commit('UPDATE_USER', res.data)
    //     return res.data
    //   })
    // },

    // me ({ commit, state }) {
    //   state.loadingMe = true
    //   return AXIOS.get('me').then((res) => {
    //     commit('SET_USER', res.data)
    //     commit('auth/SET_LOGIN_STATE', true, { root: true })
    //     state.loadingMe = false
    //     return res.data
    //   })
    // }
}

export default {
    namespaced: true,
    state: init_state(),
    mutations,
    actions,
    // getters: getters()
}
