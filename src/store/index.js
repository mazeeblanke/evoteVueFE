import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import campaign from './modules/campaign'
import app from './modules/app'
import auth from './modules/auth'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

const store = new Vuex.Store({
  plugins: [createPersistedState()],
  modules: {
    app,
    auth,
    campaign,
    user
  }
})

export default store
