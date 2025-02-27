import './assets/main.scss'

import { createApp } from 'vue'
import { GovUkVue } from 'govuk-vue'
import App from './App.vue'

createApp(App).use(GovUkVue).mount('#app')
