import { createApp } from "vue";
import "./assets/tailwind.css";
import router from "./router";
import { createPinia } from "pinia";
import App from "./App.vue";
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import { OhVueIcon, addIcons } from "oh-vue-icons";

import {
  RiHomeLine,
  RiCompassLine,
  RiAddBoxLine,
  RiMessage2Line,
  RiUserLine,
  RiLogoutBoxLine,
  RiThumbUpLine,
  RiChat1Line,
  RiSearchLine,
} from "oh-vue-icons/icons";

addIcons(
  RiHomeLine,
  RiCompassLine,
  RiAddBoxLine,
  RiMessage2Line,
  RiUserLine,
  RiLogoutBoxLine,
  RiThumbUpLine,
  RiChat1Line,
  RiSearchLine
);

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(Toast);
app.use(router);
app.mount("#app");
app.component("v-icon", OhVueIcon);
