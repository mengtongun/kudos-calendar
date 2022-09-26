import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import ToastService from "primevue/toastservice";
import DialogService from "primevue/dialogservice";
import Toast from "primevue/toast";
import DynamicDialog from "primevue/dynamicdialog";
import ColorPicker from "primevue/colorpicker";
import Image from "primevue/image";
import InputSwitch from "primevue/inputswitch";
import Calendar from "primevue/calendar";
import Editor from "primevue/editor";
import ProgressBar from "primevue/progressbar";
import FileUpload from "primevue/fileupload";
import Skeleton from "primevue/skeleton";
import Card from "primevue/card";
import FullCalendar from "@fullcalendar/vue3/dist/FullCalendar";

import "primevue/resources/themes/saga-blue/theme.css"; // theme
import "primevue/resources/themes/vela-blue/theme.css"; // theme
import "primevue/resources/primevue.min.css"; // core css
import "primeicons/primeicons.css"; // icons
import "primeflex/primeflex.scss";

import AmplifyVue from "@aws-amplify/ui-vue";

const app = createApp(App);
app.use(AmplifyVue);
app.use(PrimeVue);
app.use(ToastService);
app.use(DialogService);

app.component("Dialog", Dialog);
app.component("Button", Button);
app.component("InputText", InputText);
app.component("Toast", Toast);
app.component("DynamicDialog", DynamicDialog);
app.component("ColorPicker", ColorPicker);
app.component("Image", Image);
app.component("InputSwitch", InputSwitch);
app.component("Calendar", Calendar);
app.component("Editor", Editor);
app.component("ProgressBar", ProgressBar);
app.component("FileUpload", FileUpload);
app.component("Skeleton", Skeleton);
app.component("Card", Card);

app.component("FullCalendar", FullCalendar);

app.mount("#app");
