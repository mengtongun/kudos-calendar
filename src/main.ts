import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import PrimeVue from "primevue/config";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import ToastService from "primevue/toastservice";
import DialogService from "primevue/dialogservice";
import Toast from "primevue/toast";
import OverlayPanel from "primevue/overlaypanel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import DynamicDialog from "primevue/dynamicdialog";
import Panel from "primevue/panel";
import Menu from "primevue/menu";

import FullCalendar from "@fullcalendar/vue3/dist/FullCalendar";

import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "primevue/resources/themes/vela-blue/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons

import AmplifyVue from "@aws-amplify/ui-vue";

const app = createApp(App);
app.use(store);
app.use(router);
app.use(AmplifyVue);
app.use(PrimeVue);
app.use(ToastService);
app.use(DialogService);

app.component("Dialog", Dialog);
app.component("Button", Button);
app.component("InputText", InputText);
app.component("Toast", Toast);
app.component("OverlayPanel", OverlayPanel);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("DynamicDialog", DynamicDialog);
app.component("Panel", Panel);
app.component("Menu", Menu);

app.component("FullCalendar", FullCalendar);

app.mount("#app");
