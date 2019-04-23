import { AXIOS } from '../../services/ApiService';

const init_state = () => {
  return {

  }
}

const mutations = {

}

const actions = {

  setVotes (context, payload) {
    return AXIOS.post('votes', payload).then((res) => {
      return res.data
    })
  },

  liveVote (context, { id }) {
    // console.log(id);
    return AXIOS.get(`votes/liveVote/${id}`).then((res) => {
      return res.data
    })
  },

  liveVoteResults (context, { id }) {
    return AXIOS.get(`votes/voteResults/${id}`).then((res) => {
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
