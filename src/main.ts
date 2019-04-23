import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from '@/App.vue'
import router from './router'
import store from './store'
import VueProgressBar from 'vue-progressbar'
import {
  Select,
  Carousel,
  CarouselItem,
  Radio,
  Loading,
  Option,
  Tabs,
  TabPane
} from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'

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

Vue.use(Select)
Vue.use(Radio)
Vue.use(Option)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Loading)
Vue.use(VueProgressBar, options)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
