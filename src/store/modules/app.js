

const state = () => ({
  drawer: true,
  darkMode: true,
  snackbarText: null,
  snackbar: false,
  snackbarColor: 'success',
  timeout: 6000,
  'multi-line': true,
  position: 'right'
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
      let { msg, color, timeout, position, multiLine } = payload
      state.snackbar = true
      state.snackbarColor = color || state.snackbarColor
      state.timeout = timeout < 0 ? state.timeout : timeout
      state.position = position || state.position
      state['multi-line'] = multiLine || state['multi-line']
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
