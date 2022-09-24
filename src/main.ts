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
import Card from "primevue/card";
import ColorPicker from "primevue/colorpicker";
import Image from "primevue/image";
import InputSwitch from "primevue/inputswitch";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import InputMask from "primevue/inputmask";
import Checkbox from "primevue/checkbox";
import RadioButton from "primevue/radiobutton";
import MultiSelect from "primevue/multiselect";
import Listbox from "primevue/listbox";
import Calendar from "primevue/calendar";
import Password from "primevue/password";
import ToggleButton from "primevue/togglebutton";
import Slider from "primevue/slider";
import Rating from "primevue/rating";
import Textarea from "primevue/textarea";
import Editor from "primevue/editor";
import FullCalendar from "@fullcalendar/vue3/dist/FullCalendar";

import "primevue/resources/themes/saga-blue/theme.css"; // theme
import "primevue/resources/themes/vela-blue/theme.css"; // theme
import "primevue/resources/primevue.min.css"; // core css
import "primeicons/primeicons.css"; // icons
import "primeflex/primeflex.scss";

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
app.component("Card", Card);
app.component("ColorPicker", ColorPicker);
app.component("Image", Image);
app.component("InputSwitch", InputSwitch);
app.component("InputNumber", InputNumber);
app.component("Dropdown", Dropdown);
app.component("InputMask", InputMask);
app.component("Checkbox", Checkbox);
app.component("RadioButton", RadioButton);
app.component("MultiSelect", MultiSelect);
app.component("Listbox", Listbox);
app.component("Calendar", Calendar);
app.component("Password", Password);
app.component("ToggleButton", ToggleButton);
app.component("Slider", Slider);
app.component("Rating", Rating);
app.component("Textarea", Textarea);
app.component("Editor", Editor);

app.component("FullCalendar", FullCalendar);

app.mount("#app");
