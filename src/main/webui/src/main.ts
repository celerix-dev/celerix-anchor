import '@tabler/icons-webfont/dist/tabler-icons.min.css';
import 'celerix-spectrum/css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createSpectrum } from "celerix-spectrum/vue";

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(createSpectrum({prefix: 'cx'}))
app.use(router)

app.mount('#app')
