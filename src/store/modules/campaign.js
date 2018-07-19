import Vue from 'vue'

const init_state = () => {
    return {
        campaign: {},
        loadingMe: false,
        campaigns: {data: []}
    }
}

const mutations = {
    SET_CAMPAIGN (state, payload) {
        state.campaign = payload
    },

    SET_CAMPAIGNS (state, payload) {
        state.campaigns = payload
    },

    UPDATE_CAMPAIGN (state, {data}) {
      let foundCampaignIndex = state.campaigns.data.findIndex((campaign) => campaign.id === data.id)
      if (foundCampaignIndex > -1) {
        state.campaigns.data[foundCampaignIndex] = data
      }
    }
}

const actions = {
    loadCampaigns ({ commit }, payload) {
        return Vue.axios.get('campaigns', { params: payload }).then((res) => {
          commit('SET_CAMPAIGNS', res.data)
        })
    },

    updateCampaign ({ commit }, payload) {
      return Vue.axios.patch(`campaigns/${payload.id}`, payload).then((res) => {
        commit('SET_CAMPAIGN', res.data.data)
        return res.data
      })
    },

    verifyCampaign ({ commit }, payload) {
      return Vue.axios.patch('verifyCampaign', payload).then((res) => {
        commit('UPDATE_CAMPAIGN', res.data)
        return res.data
      })
    },

    me ({ commit, state }) {
      state.loadingMe = true
      return Vue.axios.get('me').then((res) => {
        commit('SET_CAMPAIGN', res.data)
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
