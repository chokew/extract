import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import {store, key} from "./store";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style/index.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './utils/indexdb.ts'

const app = createApp(App)
app.use(store, key).use(router).use(ElementPlus).mount("#app");
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
