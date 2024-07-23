import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import VueExcelEditor from "vue3-excel-editor";

import { marked } from "marked";

import mdOption from "@/config/marked.js";

const app = createApp(App);

app.use(router);

app.use(VueExcelEditor);

// apply default markdown configurations globaly
marked.setOptions(mdOption);

app.mount("#app");
