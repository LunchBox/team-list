import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import VueExcelEditor from "vue3-excel-editor";

const app = createApp(App);

app.use(router);

app.use(VueExcelEditor);

app.mount("#app");
