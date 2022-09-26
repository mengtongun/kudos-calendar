<script setup lang="ts">
import { inject, onBeforeMount, reactive, Ref, ref } from "vue";
import { FORM_DEFAULT_BG_COLOR, FORM_DEFAULT_BORDER_COLOR, FORM_DEFAULT_TEXT_COLOR, TOAST_ERROR_CONFIG, TOAST_SUCCESS_CONFIG } from "@/constants";
import { CalendarApi, DateSelectArg, EventApi } from "@fullcalendar/common";
import { useToast } from "primevue/usetoast";
import { Storage } from "@aws-amplify/storage";

// **** SERVICES ****
const toast = useToast();

// **** STATE ****
const eventRef = ref<EventApi>();
const dialogRef = inject("dialogRef") as Ref;
const isImg = ref<boolean>(false);
const img_loading = ref<boolean>(false);
const img_url = ref<string>("");
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
  img: "",
});

// **** METHODS ****
const onAddEvent = () => {
  if (!state.start || !state.end) {
    toast.add({ ...TOAST_ERROR_CONFIG, detail: "Start and End date are required" });
    return;
  }
  const calendarApi = dialogRef.value.data.calendarApi as CalendarApi;
  const event = {
    id: state.id || "",
    title: state.title || "No Title",
    start: state.start,
    end: state.end,
    allDay: state.allDay,
    description: state.description,
    backgroundColor: state.backgroundColor,
    borderColor: state.borderColor,
    textColor: state.textColor,
    img: state.img,
  };
  if (state.id) {
    eventRef.value?.remove();
  }
  calendarApi.addEvent(event);
  dialogRef.value.close();
};
/* eslint-disable */
const onUploader = async (event: any) => {
  const file = event.files[0] as File;
  const res = await Storage.put(file.name, file, {
    level: "private",
    contentType: file.type,
  });

  state.img = res.key;
  toast.add({ ...TOAST_SUCCESS_CONFIG, detail: "Image uploaded" });
  if (state.img) {
    img_loading.value = true;
    Storage.get(state.img, { level: "private" }).then((res) => {
      img_url.value = res;
    });
  }
  return file;
};

// **** HOOKS ****
onBeforeMount(() => {
  const event = dialogRef.value.data.event as EventApi & DateSelectArg;
  eventRef.value = event;
  state.id = event.id;
  state.title = event.title || "";
  state.start = event.start || new Date();
  state.end = event.end || new Date();
  state.allDay = event.allDay;
  state.description = event.extendedProps?.description || "";
  state.backgroundColor = event.backgroundColor || FORM_DEFAULT_BG_COLOR;
  state.borderColor = event.borderColor || FORM_DEFAULT_BORDER_COLOR;
  state.textColor = event.textColor || FORM_DEFAULT_TEXT_COLOR;
  state.img = event.extendedProps?.img || "";
  if (state.img) {
    img_loading.value = true;
    Storage.get(state.img, { level: "private" }).then((res) => {
      img_url.value = res;
    });
  }
});
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
          <Button icon="pi pi-calendar-plus" label="Save" class="p-button-lg" @click="onAddEvent" />
        </div>
      </div>
      <!-- //* DateTime Setting -->
      <div class="flex flex-row justify-content-start my-4">
        <p class="my-auto mr-4 font-bold">All Days</p>
        <InputSwitch v-model="state.allDay" />
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

      <!-- //* Event Image Upload -->
      <div class="mt-4" v-if="!state.img">
        <div class="flex flex-row justify-content-start">
          <input type="checkbox" :checked="isImg" @change="isImg = !isImg" />
          <p class="my-auto mr-4 font-bold cursor-pointer" @click="isImg = !isImg">Event Image</p>
        </div>
        <div class="flex flex-row justify-content-start mt-2">
          <FileUpload v-if="isImg" name="img[]" :multiple="false" accept="image/*" :previewWidth="250" :maxFileSize="5000000" :customUpload="true" @uploader="onUploader" />
        </div>
      </div>

      <!-- //* Image Display -->
      <div class="my-4" v-else>
        <p class="my-auto mr-4 font-bold cursor-pointer text-red-500" @click="isImg = !isImg">Image Uploaded</p>
        <div class="flex flex-row justify-content-start mt-2">
          <Image v-show="!img_loading" class="" imageClass="w-15rem border-round-md" :src="img_url" :alt="state.img" preview @load="img_loading = false" />
          <Skeleton v-show="img_loading" class="w-15rem h-8rem my-4 border-round-md" />
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
