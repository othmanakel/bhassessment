import { createApp } from 'vue'
import App from './App.vue'

import Aura from '@primevue/themes/aura'
import PrimeVue from 'primevue/config'

import '@/assets/styles.scss'
import '@/assets/tailwind.css'

const app = createApp(App)

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
})

app.mount('#app')
