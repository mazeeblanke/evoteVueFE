import Vue from 'vue'

const init_state = () => {
    return {
        user: {},
        loadingMe: false,
        users: {data: []}
    }
}

const mutations = {
    SET_USER (state, payload) {
        state.user = payload
    },

    SET_USERS (state, payload) {
        state.users = payload
    },

    UPDATE_USER (state, {data}) {
      let foundUserIndex = state.users.data.findIndex((user) => user.id === data.id)
      if (foundUserIndex > -1) {
        state.users.data[foundUserIndex] = data
      }
    }
}

const actions = {
    loadUsers ({ commit }, payload) {
        return Vue.axios.get('users', { params: payload }).then((res) => {
          commit('SET_USERS', res.data)
          return res.data
        })
    },

    updateUser ({ commit }, payload) {
      return Vue.axios.patch(`users/${payload.id}`, payload).then((res) => {
        commit('SET_USER', res.data.data)
        return res.data
      })
    },

    verifyUser ({ commit }, payload) {
      return Vue.axios.patch('verifyUser', payload).then((res) => {
        commit('UPDATE_USER', res.data)
        return res.data
      })
    },

    me ({ commit, state }) {
      state.loadingMe = true
      return Vue.axios.get('me').then((res) => {
        commit('SET_USER', res.data)
        commit('auth/SET_LOGIN_STATE', true, { root: true })
        state.loadingMe = false
        return res.data
      })
    }
}

export default {
    namespaced: true,
    state: init_state(),
    mutations,
    actions
}
