import './assets/main.scss'

import { createApp } from 'vue'
import { GovUkVue } from 'govuk-vue'
import VueMatomo from 'vue-matomo'
import App from './App.vue'

createApp(App).use(GovUkVue).use(VueMatomo, {
  host: 'https://ambiph.one/analytics',
  siteId: 8,
  disableCookies: true,
  enableHeartBeatTimer: true
}).mount('#app')
