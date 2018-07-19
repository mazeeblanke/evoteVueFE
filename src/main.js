import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueProgressBar from 'vue-progressbar'

const options = {
  // color: '#bffaf3',
  color: '#FF9800',
  failedColor: '#874b4b',
  thickness: '3px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

Vue.use(VueProgressBar, options)

Vue.use(VueAxios, axios)

window.clBaseURL = 'https://res.cloudinary.com/dpisximfc/image/upload/w_120,h_120,c_fill,g_auto,q_auto,f_auto/'
window.baseUrl = process.env.NODE_ENV === 'development'
  ? `http://evote.test/api`
  : 'https://arcane-refuge-82130.herokuapp.com/public/api'

axios.interceptors.request.use((config) => {
    const baseUrl = window.baseUrl
    let token
    config.url = `${baseUrl}/${config.url}`
    config.headers['Content-Type'] = 'application/json'
    if ((token = localStorage.getItem('auth_token'))) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config;
  }, (error) => Promise.reject(error)
)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
