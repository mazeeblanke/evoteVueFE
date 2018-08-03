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

    CLEAR_SELECTED_CAMPAIGN (state) {
      state.selectedCampaign = {
        campaign_positions: []
      }
    },

    SET_CAMPAIGNS (state, payload) {
      state.campaigns = payload
    },

    ADD_CAMPAIGN (state, {data}) {
      state.campaigns.data.unshift(data)
    },

    REMOVE_CAMPAIGN (state, id) {
      let index = state.campaigns.data.findIndex(c => c.id === id)
      console.log(index)
      state.campaigns.data.splice(index, 1);
    },

    REMOVE_CAMPAIGN_POSITION (state, id) {
      let index = state.selectedCampaign.campaign_positions.findIndex(cp => cp.id === id)
      console.log(index)
      state.selectedCampaign.campaign_positions.splice(index, 1);
    },

    ADD_CAMPAIGN_POSITION (state, {data}) {
      let campaignPositions = state.selectedCampaign.campaign_positions

      // state.selectedCampaign.campaign_positions.unshift(data[0])

      state.selectedCampaign.campaign_positions = [
        ...data,
        ...campaignPositions
      ]

      // if (campaignPositions.length > 10) {
      //   state.selectedCampaign.campaign_positions = campaignPositions.slice(0, 9);
      // }
    },

    ADD_CAMPAIGN_POSITION_NORMINEES (state, {data}) {
      console.log(data)
    },

    UPDATE_SELECTED_CAMPAIGN (state, {data}) {
      let foundIndex = state
      .campaigns
      .data
      .map(campaign => ({
        ...campaign,
        active: false
      }))
      .findIndex((campaign) => campaign.id === data.id)
      if (foundIndex > -1) {
        Vue.set(
          state.campaigns.data,
          foundIndex,
          data
        )
      }
    },

    UPDATE_SELECTED_CAMPAIGN_POSITION (state, {data}) {
      let foundIndex = state
      .selectedCampaign
      .campaign_positions
      .findIndex((campaign) => campaign.id === data.id)
      if (foundIndex > -1) {
        Vue.set(
          state.selectedCampaign.campaign_positions,
          foundIndex,
          data
        )
      }
    }
}

const actions = {
    loadCampaigns ({ commit }, payload) {
        return Vue.axios.get('campaigns', { params: payload }).then((res) => {
          commit('SET_CAMPAIGNS', res.data)
        })
    },

    deleteNorminee ({ commit }, payload) {
      return Vue.axios.delete(`campaign-position-norminations/${payload.campaign_position_id}`, { data: payload })
      .then((res) => {
        return res.data
      })
    },

    loadCampaign ({ commit }, payload) {
      return Vue.axios.get(`campaigns/${payload.id}`).then((res) => {
        commit('SET_SELECTED_CAMPAIGN', res.data)
        return res.data
      })
    },

    deleteCampaign ({ commit }, payload) {
      return Vue.axios.delete(`campaigns/${payload.id}`).then((res) => {
        commit('REMOVE_CAMPAIGN', payload.id)
        return res.data
      })
    },

    deleteCampaignPosition ({ commit }, payload) {
      return Vue.axios.delete(`campaign-positions/${payload.id}`).then((res) => {
        commit('REMOVE_CAMPAIGN_POSITION', payload.id)
        return res.data
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

    setActiveCampaign ({ commit }, payload) {
      return Vue.axios.post('campaigns/setActiveCampaign', payload).then((res) => {
        commit('UPDATE_SELECTED_CAMPAIGN', res.data)
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
