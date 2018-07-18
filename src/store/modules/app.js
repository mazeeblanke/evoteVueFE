

const state = () => ({
  drawer: true,
  darkMode: true,
  snackbarText: null,
  snackbar: false,
  snackbarColor: 'success'
})

const mutations = {
  TOGGLE_DRAWER (state) {
    state.drawer = !state.drawer
  },

  TOGGLE_DARK_MODE (state) {
    state.darkMode = !state.darkMode
  },

  TOGGLE_SNACKBAR (state, payload) {
    if (!payload) {
      state.snackbar = false
    } else {
      let { msg, color } = payload
      state.snackbar = true
      state.snackbarColor = color
      state.snackbarText = msg
    }
  }
}

const actions = {

}

export default {
  namespaced: true,
  state: state(),
  mutations,
  actions
}
