import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import './registerServiceWorker.js';

//import { createGtm } from "@gtm-support/vue-gtm";
import VueGtag from 'vue-gtag'
loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  //.use(createGtm({id: "G-24T9XF15YJ"}))
  .use(VueGtag, {config: {id: 'G-24T9XF15YJ'}}, router)
  .mount('#app')
