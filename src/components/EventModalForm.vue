<script setup lang="ts">
import { EventApiData } from "@/types";
import { inject, onBeforeMount, onUpdated, reactive, Ref, ref } from "vue";
import { useStore } from "vuex";
import { FORM_DEFAULT_BG_COLOR, FORM_DEFAULT_BORDER_COLOR, FORM_DEFAULT_TEXT_COLOR } from "@/constants";
import { CalendarApi, DateSelectArg } from "@fullcalendar/common";
import { useToast } from "primevue/usetoast";
import { createEventId } from "@/utils/event-utils";
const store = useStore();
const toast = useToast();

const state = reactive({
  id: "",
  title: "",
  start: new Date(),
  end: new Date(),
  allDay: false,
  description: "",
  backgroundColor: "#3f51b5",
  borderColor: "#3f51b5",
  textColor: "#ffffff",
  extendedProps: {},
});

const is_loading = ref<boolean>(false);
const dialogRef = inject("dialogRef") as Ref;
onBeforeMount(() => {
  const event = dialogRef.value.data.event as EventApiData & DateSelectArg;
  if (event) {
    state.id = event.id;
    state.title = event.title || "";
    state.start = event.start || new Date();
    state.end = event.end || new Date();
    state.allDay = event.allDay;
    state.description = event.description;
    state.backgroundColor = event.backgroundColor || FORM_DEFAULT_BG_COLOR;
    state.borderColor = event.borderColor || FORM_DEFAULT_BORDER_COLOR;
    state.textColor = event.textColor || FORM_DEFAULT_TEXT_COLOR;
    state.extendedProps = event.extendedProps;
  }
});

onUpdated(() => {
  console.log("state", state);
});
const onAddEvent = () => {
  console.log("state", state);
  const calendarApi = dialogRef.value.data.calendarApi as CalendarApi;
  toast.add({ severity: "success", summary: "Success", detail: "Event Added", life: 3000 });
  if (state.id) {
    calendarApi.addEvent({
      id: state.id,
      title: state.title,
      start: state.start,
      end: state.end,
      allDay: state.allDay,
      description: state.description,
      backgroundColor: state.backgroundColor,
      borderColor: state.borderColor,
      textColor: state.textColor,
      extendedProps: state.extendedProps,
    });
    return;
  }
  calendarApi.addEvent({
    id: createEventId(),
    title: state.title,
    start: state.start,
    end: state.end,
    allDay: state.allDay,
    description: state.description,
    backgroundColor: state.backgroundColor,
    borderColor: state.borderColor,
    textColor: state.textColor,
    extendedProps: state.extendedProps,
  });
  dialogRef.value.close();
};
const onAddEvent1 = () => {
  if (!state.title) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Title is required",
      life: 3000,
    });
    return;
  }
  if (!state.start) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Start date is required",
      life: 3000,
    });
    return;
  }
  is_loading.value = true;
  console.log("id event", state.id);
  store
    .dispatch(`${!state.id ? "addEvent" : "updateEvent"}`, state)
    .then(() => {
      toast.removeAllGroups();
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Event added",
        life: 3000,
      });
    })
    .catch((err) => {
      toast.removeAllGroups();
      toast.add({
        severity: "error",
        summary: "Error",
        detail: err.message,
        life: 3000,
      });
    })
    .finally(() => {
      is_loading.value = false;
      dialogRef.value.close();
    });
};
</script>

<template>
  <form>
    <div class="p-4">
      <!-- //* Title Form -->
      <div class="flex flex-row justify-content-between">
        <div class="w-7">
          <span class="p-float-label mt-2">
            <InputText id="title" type="text" v-model="state.title" class="p-inputtext-lg w-full border-round-md" />
            <label for="title" class="text-xl">Event Title</label>
          </span>
        </div>
        <!-- Big Save Button -->
        <div>
          <Button icon="pi pi-save" :loading="is_loading" label="Save" class="p-button-lg" @click="onAddEvent" />
        </div>
      </div>
      <!-- //* DateTime Setting -->
      <div class="block w-full my-4">
        <div class="inline-block w-2">
          <p class="inline-block">All Days</p>
          <InputSwitch class="inline-block vertical-align-middle ml-4" v-model="state.allDay" />
        </div>
      </div>
      <div class="flex flex-wrap justify-content-start card-container blue-container gap-3">
        <!-- //* DateStart -->
        <div class="flex align-items-center justify-content-center">
          <Calendar v-model="state.start" class="border-round-md" />
        </div>
        <!-- //* TimeStart -->
        <div v-if="!state.allDay" class="flex align-items-center justify-content-center">
          <Calendar v-model="state.start" timeOnly hourFormat="12" class="border-round-md" />
        </div>
        <!-- //* DateEnd -->
        <div class="flex align-items-center justify-content-center">to</div>
        <div class="flex align-items-center justify-content-center">
          <Calendar v-model="state.end" class="border-round-lg" />
        </div>
        <!-- //* TimeEnd -->
        <div v-if="!state.allDay" class="flex align-items-center justify-content-center">
          <Calendar v-model="state.end" timeOnly hourFormat="12" class="border-round-lg" />
        </div>
      </div>
      <!-- //* Event Detail Form -->
      <div class="flex flex-wrap justify-content-start gap-3 mt-4">
        <!-- //* Editor Description -->
        <div class="block">
          <span class="mt-2">
            <label for="description" class="block mb-2">Event Description</label>
            <Editor v-model="state.description" editorStyle="height: 320px; width: 50vw;">
              <template #toolbar>
                <span class="ql-formats">
                  <select class="ql-size">
                    <option value="small"></option>
                    <option selected></option>
                    <option value="large"></option>
                    <option value="huge"></option>
                  </select>
                  <button class="ql-bold"></button>
                  <button class="ql-italic"></button>
                  <button class="ql-underline"></button>
                  <select class="ql-color"></select>
                  <select class="ql-background"></select>
                  <button class="ql-list" value="ordered"></button>
                  <button class="ql-list" value="bullet"></button>
                  <button class="ql-align" value="center"></button>
                  <button class="ql-align" value="right"></button>
                  <button class="ql-align" value="justify"></button>
                  <button class="ql-link"></button>
                </span>
              </template>
            </Editor>
          </span>
        </div>
        <div class="block">
          <!-- //* Background Color -->
          <div class="block mb-4">
            <label for="backgroundColor" class="block mb-2">Background Color</label>
            <span class="flex flex-row justify-content-start align-items-center gap-2">
              <ColorPicker v-model="state.backgroundColor" @change="state.backgroundColor = '#' + state.backgroundColor" class="vertical-align-middle" />
              <InputText id="backgroundColor" type="text" v-model="state.backgroundColor" class="w-7" />
            </span>
          </div>
          <!-- //* Border Color -->
          <div class="block mb-4">
            <label for="borderColor" class="block mb-2">Border Color</label>
            <span class="flex flex-row justify-content-start align-items-center gap-2">
              <ColorPicker v-model="state.borderColor" @change="state.borderColor = '#' + state.borderColor" class="vertical-align-middle" />
              <InputText id="borderColor" type="text" v-model="state.borderColor" class="w-7" />
            </span>
          </div>
          <!-- //* Text Color -->
          <div class="block mb-4">
            <label for="textColor" class="block mb-2">Text Color</label>
            <span class="flex flex-row justify-content-start align-items-center gap-2">
              <ColorPicker v-model="state.textColor" @change="state.textColor = '#' + state.textColor" class="vertical-align-middle" />
              <InputText id="textColor" type="text" v-model="state.textColor" class="w-7" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
.p-float-label input:focus ~ label,
.p-float-label input.p-filled ~ label {
  top: -1.5rem;
}
</style>
