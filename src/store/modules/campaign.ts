import Vue from 'vue'
import { AXIOS } from '../../services/ApiService';

/* eslint-disable */

const init_state = () => {
    return {
        selectedCampaign: {
          campaign_positions: [],
          users: { data: [] }
        },
        loadingMe: false,
        campaigns: {data: []},
        completedCampaigns: {data: []},
        newCampaigns: {data: []},
        activeTab: 'Active Campaigns'
    }
}

const mutations = {
    SET_SELECTED_CAMPAIGN (state, {data}) {
        state.selectedCampaign = { ...data, users: { data: [] } }
    },

    SET_ACTIVE_TAB (state, newValue) {
      state.activeTab = newValue
    },

    CLEAR_STATE(state) {
      let newstate = init_state();
      state.selectedCampaign = newstate.selectedCampaign
      state.completedCampaigns = newstate.completedCampaigns
      state.campaigns = newstate.campaigns
      state.newCampaigns = newstate.newCampaigns
    },

    SET_SELECTED_CAMPAIGN_USERS (state, data) {
      state.selectedCampaign.users = data
    },

    CLEAR_SELECTED_CAMPAIGN (state) {
      state.selectedCampaign = {
        campaign_positions: [],
        users: {
          data: []
        }
      }
    },

    SET_CAMPAIGNS (state, payload) {
      state.campaigns = payload
    },

    SET_COMPLETED_CAMPAIGNS (state, payload) {
      state.completedCampaigns = payload
    },

    SET_NEW_CAMPAIGNS (state, payload) {
      state.newCampaigns = payload
    },

    ADD_CAMPAIGN (state, {data}) {
      state.newCampaigns.data.unshift(data)
    },

    REMOVE_CAMPAIGN (state, { id, category }) {
      // console.log(category)
      let index = state[category].data.findIndex(c => {
        // console.log(c.id, id)
        return c.id === id
      })
      state[category].data.splice(index, 1);
    },

    REMOVE_CAMPAIGN_POSITION (state, id) {
      let index = state.selectedCampaign.campaign_positions.findIndex(cp => cp.id === id)
      state.selectedCampaign.campaign_positions.splice(index, 1);
    },

    ADD_CAMPAIGN_POSITION (state, {data}) {
      let campaignPositions = state.selectedCampaign.campaign_positions

      state.selectedCampaign.campaign_positions = [
        ...data,
        ...campaignPositions
      ]
    },

    ADD_CAMPAIGN_POSITION_NORMINEES (state, {data}) {
      // console.log(data)
    },

    UPDATE_SELECTED_CAMPAIGN (state, {data}) {
      // console.log(data);
      let campaign = data.category || 'campaigns'
      let foundIndex = state[campaign]
      .data
      .findIndex((campaign) => {
        // console.log(campaign.id, data.id)
        return campaign.id === data.id
      })
      // console.log(foundIndex)
      // console.log(state[campaign].data)
      if (foundIndex > -1) {
        Vue.set(
          state[campaign].data,
          foundIndex,
          data
        )
      }
    },

    ACTIVATE_CAMPAIGN (state, {data}) {
      let foundIndex = state
      .newCampaigns
      .data
      .findIndex((campaign) => {
        return campaign.id === data.id
      })
      if (foundIndex > -1) {
        state.newCampaigns.data.splice(foundIndex, 1);
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
    },

    UPDATE_SELECTED_CAMPAIGN_USER_VERIFICATION_STATUS (state, { userId, verified }) {
      let foundIndex = state
              .selectedCampaign
              .users
              .data
              .findIndex((user) => user.user_id === userId);

      if (foundIndex > -1) {
        // console.log('sdsd');
        Vue.set(
          state.selectedCampaign.users.data,
          foundIndex,
          {
            ...state.selectedCampaign.users.data[foundIndex],
            verified,
          }
        )
      }
    },

    UPDATE_CAMPAIGN_ENROLL_STATUS (state, campaignId) {
      // console.log('jjjj');
      let foundIndex = state
      .newCampaigns
      .data
      .findIndex((campaign) => campaign.id === campaignId);
      // console.log('jdjdjdjdj');
      if (foundIndex > -1) {
        // console.log('sdsd');
        Vue.set(
          state.newCampaigns.data,
          foundIndex,
          {
            ...state.newCampaigns.data[foundIndex],
            ...{
              enrolled: {
                verified: 0,
              },
              enrolling: false
            }
          }
        )
      }
    }
}

const actions = {
    loadCampaigns ({ commit }, payload) {
        return AXIOS.get('campaigns', { params: payload }).then((res) => {

          if (payload.completed === 1) {
            commit('SET_COMPLETED_CAMPAIGNS', res.data)
          } else if (payload.new === 1) {
            commit('SET_NEW_CAMPAIGNS', res.data)
          } else if (payload.active === 1) {
            commit('SET_CAMPAIGNS', res.data)
          }

        })
    },

    verifyCampaignUser ({ commit }, payload) {
      // campaigns/{campaignId}/users/{userId}verify
      // console.log(payload);
      return AXIOS.post(`campaigns/${payload.campaignId}/users/${payload.userId}/verify`, payload ).then((res) => {

        commit('UPDATE_SELECTED_CAMPAIGN_USER_VERIFICATION_STATUS', payload)

      })
    },

    loadCampaignUsers({ commit }, payload) {
      // console.log(payload);
      return AXIOS.get(`campaigns/${payload.campaignId}/users`, { params: payload }).then((res) => {

        commit('SET_SELECTED_CAMPAIGN_USERS', res.data)

        // if (payload.completed === 1) {
        //   commit('SET_COMPLETED_CAMPAIGNS', res.data)
        // } else if (payload.new === 1) {
        //   commit('SET_NEW_CAMPAIGNS', res.data)
        // } else if (payload.active === 1) {
        //   commit('SET_CAMPAIGNS', res.data)
        // }

      })
    },

    enroll({ commit }, { campaignId, userId }) {
      // console.log(CampaignService);
      // return CampaignService.enroll(payload);
      return AXIOS.post(`campaigns/enroll`, { userId, campaignId }).then((res) => {
        // console.log('jsjjd skjkd sjd dkj')
        commit('UPDATE_CAMPAIGN_ENROLL_STATUS', campaignId);
        return res.data
      })
    },

    disableActiveCampaign () {
      return AXIOS.post('campaigns/disableActiveCampaign').then((res) => {
        return res.data
      })
    },

    deleteNorminee ({ commit }, payload) {
      return AXIOS
      .delete(`campaign-position-norminations/${payload.campaign_position_id}`, {
        data: payload
      })
      .then((res) => {
        return res.data
      })
    },

    loadCampaign ({ commit }, payload) {
      return AXIOS.get(`campaigns/${payload.id}`).then((res) => {
        commit('SET_SELECTED_CAMPAIGN', res.data)
        return res.data
      })
    },

    deleteCampaign ({ commit }, payload) {
      return AXIOS.delete(`campaigns/${payload.id}`).then((res) => {
        commit('REMOVE_CAMPAIGN', { id: payload.id, category: payload.category })
        return res.data
      })
    },

    deleteCampaignPosition ({ commit }, payload) {
      return AXIOS.delete(`campaign-positions/${payload.id}`).then((res) => {
        commit('REMOVE_CAMPAIGN_POSITION', payload.id)
        return res.data
      })
    },

    updateCampaign ({ commit }, payload) {
      return AXIOS.patch(`campaigns/${payload.id}`, payload).then((res) => {
        commit('SET_SELECTED_CAMPAIGN', res.data)
        res.data.data = { ...res.data.data, category: payload.category }
        commit('UPDATE_SELECTED_CAMPAIGN', res.data)
        return res.data
      })
    },

    createCampaign ({ commit }, payload) {
      return AXIOS.post('campaigns', payload).then((res) => {
        commit('ADD_CAMPAIGN', res.data)
        return res.data
      })
    },

    setActiveCampaign ({ commit }, payload) {
      return AXIOS.post('campaigns/setActiveCampaign', payload).then((res) => {
        commit('ACTIVATE_CAMPAIGN', { ...res.data, category: 'newCampaigns' })
        return res.data
      })
    },

    addCampaignPositionNorminees ({ commit }, payload) {
      return AXIOS.post('campaign-position-norminations', payload).then((res) => {
        commit('ADD_CAMPAIGN_POSITION_NORMINEES', res.data)
        return res.data.data
      })
    },

    updateCampaignPosition ({ commit }, payload) {
      return AXIOS.patch(`campaign-positions/${payload.id}`, payload).then((res) => {
        commit('UPDATE_SELECTED_CAMPAIGN_POSITION', res.data)
        return res.data
      })
    },

    createCampaignPosition ({ commit }, payload) {
      return AXIOS.post('campaign-positions', payload).then((res) => {
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
