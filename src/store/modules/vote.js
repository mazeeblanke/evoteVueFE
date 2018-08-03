import Vue from 'vue'

const init_state = () => {
  return {

  }
}

const mutations = {

}

const actions = {
  setVotes ({ commit }, payload) {
    return Vue.axios.post('votes', payload).then((res) => {
      return res.data
    })
  },

  liveVote ({ commit }) {
    return Vue.axios.get('votes/liveVote').then((res) => {
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
