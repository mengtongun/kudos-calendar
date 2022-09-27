<script setup lang="ts">
import { Events, inject, onBeforeMount, onBeforeUnmount, reactive, Ref, ref } from "vue";
import { FORM_DEFAULT_BG_COLOR, FORM_DEFAULT_BORDER_COLOR, FORM_DEFAULT_TEXT_COLOR, TOAST_ERROR_CONFIG, TOAST_SUCCESS_CONFIG } from "@/constants";
import { CalendarApi, DateSelectArg, EventApi } from "@fullcalendar/common";
import { useToast } from "primevue/usetoast";
import { Storage } from "@aws-amplify/storage";
import Editor from "primevue/editor";

// **** SERVICES ****
const toast = useToast();

// **** STATE ****
const eventRef = ref<EventApi>();
const dialogRef = inject("dialogRef") as Ref;
const isImg = ref<boolean>(false);
const img_loading = ref<boolean>(false);
const img_url = ref<string>("");
const editorRef = ref<Editor | null>(null);
const form = reactive({
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
const onAddEvent = async () => {
  if (!form.start || !form.end) {
    toast.add({ ...TOAST_ERROR_CONFIG, detail: "Start and End date are required" });
    return;
  }
  const calendarApi = dialogRef.value.data.calendarApi as CalendarApi;
  const updateEvent = dialogRef.value.data.updateEvent as (eventApi: Partial<EventApi>) => Promise<Events>;
  const addEvent = dialogRef.value.data.addEvent as (eventApi: Partial<EventApi>) => Promise<Events>;
  const event = {
    id: form.id || "",
    title: form.title || "No Title",
    start: form.start,
    end: form.end,
    allDay: form.allDay,
    extendedProps: {
      description: form.description,
      img: form.img,
    },
    backgroundColor: form.backgroundColor,
    borderColor: form.borderColor,
    textColor: form.textColor,
  };
  let result: Events;
  if (form.id) {
    result = await updateEvent(event);
    if (!result) {
      toast.add({ ...TOAST_ERROR_CONFIG, detail: "Error updating event" });
      return;
    }
    eventRef.value?.remove();
  } else {
    result = await addEvent(event);
  }
  calendarApi.addEvent(result);
  dialogRef.value.close();
};
/* eslint-disable */
const onUploader = async (event: any) => {
  const file = event.files[0] as File;
  const res = await Storage.put(file.name, file, {
    level: "private",
    contentType: file.type,
  });

  form.img = res.key;
  toast.add({ ...TOAST_SUCCESS_CONFIG, detail: "Image uploaded" });
  if (form.img) {
    img_loading.value = true;
    Storage.get(form.img, { level: "private" }).then((res) => {
      img_url.value = res;
    });
  }
  return file;
};

// **** HOOKS ****
onBeforeMount(() => {
  const event = dialogRef.value.data.event as EventApi & DateSelectArg;
  eventRef.value = event;
  form.id = event.id;
  form.title = event.title || "";
  form.start = event.start || new Date();
  form.end = event.end || new Date();
  form.allDay = event.allDay;
  form.description = event.extendedProps?.description || "";
  form.backgroundColor = event.backgroundColor || FORM_DEFAULT_BG_COLOR;
  form.borderColor = event.borderColor || FORM_DEFAULT_BORDER_COLOR;
  form.textColor = event.textColor || FORM_DEFAULT_TEXT_COLOR;
  form.img = event.extendedProps?.img || "";
  if (form.img) {
    img_loading.value = true;
    Storage.get(form.img, { level: "private" }).then((res) => {
      img_url.value = res;
    });
  }
});

onBeforeUnmount(() => {
  editorRef.value = null;
});
</script>

<template>
  <form>
    <div class="p-4">
      <!-- //* Title Form -->
      <div class="flex flex-row justify-content-between">
        <div class="w-7">
          <span class="p-float-label mt-2">
            <InputText id="title" type="text" v-model="form.title" class="p-inputtext-lg w-full border-round-md" />
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
        <InputSwitch v-model="form.allDay" />
      </div>
      <div class="flex flex-wrap justify-content-start card-container blue-container gap-3">
        <!-- //* DateStart -->
        <div class="flex align-items-center justify-content-center">
          <Calendar v-model="form.start" class="border-round-md" />
        </div>
        <!-- //* TimeStart -->
        <div v-if="!form.allDay" class="flex align-items-center justify-content-center">
          <Calendar v-model="form.start" timeOnly hourFormat="12" class="border-round-md" />
        </div>
        <!-- //* DateEnd -->
        <div class="flex align-items-center justify-content-center">to</div>
        <div class="flex align-items-center justify-content-center">
          <Calendar v-model="form.end" class="border-round-lg" />
        </div>
        <!-- //* TimeEnd -->
        <div v-if="!form.allDay" class="flex align-items-center justify-content-center">
          <Calendar v-model="form.end" timeOnly hourFormat="12" class="border-round-lg" />
        </div>
      </div>

      <!-- //* Event Image Upload -->
      <div class="mt-4" v-if="!form.img">
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
        <p class="my-auto mr-4 font-bold cursor-pointer text-blue-500" @click="isImg = !isImg">Image Uploaded</p>
        <div class="flex flex-row justify-content-start mt-2">
          <Image v-show="!img_loading" class="" imageClass="w-15rem border-round-md" :src="img_url" :alt="form.img" preview @load="img_loading = false" />
          <Skeleton v-show="img_loading" class="w-15rem h-8rem my-4 border-round-md" />
        </div>
      </div>

      <!-- //* Event Detail Form -->
      <div class="flex flex-wrap justify-content-start gap-3 mt-4">
        <!-- //* Editor Description -->
        <div class="block">
          <span class="mt-2">
            <label for="description" class="block mb-2">Event Description</label>
            <Editor ref="editorRef" v-model="form.description" editorStyle="height: 320px; width: 50vw;">
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
              <ColorPicker v-model="form.backgroundColor" @change="form.backgroundColor = '#' + form.backgroundColor" class="vertical-align-middle" />
              <InputText id="backgroundColor" type="text" v-model="form.backgroundColor" class="w-7" />
            </span>
          </div>
          <!-- //* Border Color -->
          <div class="block mb-4">
            <label for="borderColor" class="block mb-2">Border Color</label>
            <span class="flex flex-row justify-content-start align-items-center gap-2">
              <ColorPicker v-model="form.borderColor" @change="form.borderColor = '#' + form.borderColor" class="vertical-align-middle" />
              <InputText id="borderColor" type="text" v-model="form.borderColor" class="w-7" />
            </span>
          </div>
          <!-- //* Text Color -->
          <div class="block mb-4">
            <label for="textColor" class="block mb-2">Text Color</label>
            <span class="flex flex-row justify-content-start align-items-center gap-2">
              <ColorPicker v-model="form.textColor" @change="form.textColor = '#' + form.textColor" class="vertical-align-middle" />
              <InputText id="textColor" type="text" v-model="form.textColor" class="w-7" />
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
