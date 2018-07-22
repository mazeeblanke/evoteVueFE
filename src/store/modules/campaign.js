import Vue from 'vue'

const init_state = () => {
    return {
        selectedCampaign: {
          campaign_positions: []
        },
        loadingMe: false,
        campaigns: {data: []}
    }
}

const mutations = {
    SET_SELECTED_CAMPAIGN (state, {data}) {
        state.selectedCampaign = data
    },

    SET_CAMPAIGNS (state, payload) {
      state.campaigns = payload
    },

    ADD_CAMPAIGN (state, {data}) {
      state.campaigns.data.unshift(data)
    },

    ADD_CAMPAIGN_POSITION (state, {data}) {
      state.selectedCampaign.campaign_positions = [
        ...state.selectedCampaign.campaign_positions,
        ...data
      ]
    },

    ADD_CAMPAIGN_POSITION_NORMINEES (state, {data}) {
      console.log(data)
    },

    UPDATE_SELECTED_CAMPAIGN (state, {data}) {
      let foundCampaignIndex = state
      .campaigns
      .data.findIndex((campaign) => campaign.id === data.id)
      if (foundCampaignIndex > -1) {
        state.campaigns.data[foundCampaignIndex] = data
      }
    },

    UPDATE_SELECTED_CAMPAIGN_POSITION (state, {data}) {
      let foundCampaignIndex = state
      .selectedCampaign
      .campaign_positions
      .findIndex((campaign) => campaign.id === data.id)
      if (foundCampaignIndex > -1) {
        state.selectedCampaign.campaign_positions[foundCampaignIndex] = data
      }
    }
}

const actions = {
    loadCampaigns ({ commit }, payload) {
        return Vue.axios.get('campaigns', { params: payload }).then((res) => {
          commit('SET_CAMPAIGNS', res.data)
        })
    },

    loadCampaign ({ commit }, payload) {
      return Vue.axios.get(`campaigns/${payload.id}`).then((res) => {
        commit('SET_SELECTED_CAMPAIGN', res.data)
      })
    },

    updateCampaign ({ commit }, payload) {
      return Vue.axios.patch(`campaigns/${payload.id}`, payload).then((res) => {
        commit('SET_SELECTED_CAMPAIGN', res.data)
        commit('UPDATE_SELECTED_CAMPAIGN', res.data)
        return res.data
      })
    },

    createCampaign ({ commit }, payload) {
      return Vue.axios.post('campaigns', payload).then((res) => {
        commit('ADD_CAMPAIGN', res.data)
        return res.data
      })
    },

    addCampaignPositionNorminees ({ commit }, payload) {
      return Vue.axios.post('campaign-position-norminations', payload).then((res) => {
        commit('ADD_CAMPAIGN_POSITION_NORMINEES', res.data)
        return res.data.data
      })
    },

    updateCampaignPosition ({ commit }, payload) {
      return Vue.axios.patch(`campaign-positions/${payload.id}`, payload).then((res) => {
        commit('UPDATE_SELECTED_CAMPAIGN_POSITION', res.data)
        return res.data
      })
    },

    createCampaignPosition ({ commit }, payload) {
      return Vue.axios.post('campaign-positions', payload).then((res) => {
        commit('ADD_CAMPAIGN_POSITION', res.data)
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
