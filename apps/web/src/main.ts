import { createApp } from "vue";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import App from "./App.vue";
import router from "./router";
import "./styles.css";

createApp(App)
  .use(router)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: false,
        cssLayer: {
          name: "primevue",
          order: "theme, base, primevue",
        },
      },
    },
  })
  .mount("#app");
