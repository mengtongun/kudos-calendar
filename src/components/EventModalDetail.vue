

<script setup lang="ts">
import { Ref } from "@vue/runtime-core";
import { inject, ref, onBeforeMount, defineExpose } from "vue";
import { EventApi } from "@fullcalendar/vue3";
import { useToast } from "primevue/usetoast";
const event = ref<EventApi | undefined>(undefined);

onBeforeMount(() => {
  const dialogRef = inject("dialogRef") as Ref;
  event.value = dialogRef.value.data.event;
});
const toast = useToast();
const collapsed = ref(true);
const menu = ref();
const items = ref([
  {
    label: "Options",
    items: [
      {
        label: "Update",
        icon: "pi pi-refresh",
        command: () => {
          toast.add({ severity: "success", summary: "Updated", detail: "Data Updated", life: 3000 });
        },
      },
      {
        label: "Delete",
        icon: "pi pi-times",
        command: () => {
          toast.add({ severity: "warn", summary: "Delete", detail: "Data Deleted", life: 3000 });
        },
      },
    ],
  },
  {
    label: "Navigate",
    items: [
      {
        label: "Vue Website",
        icon: "pi pi-external-link",
        url: "https://vuejs.org/",
      },
      {
        label: "Router",
        icon: "pi pi-upload",
        command: () => {
          window.location.hash = "/fileupload";
        },
      },
    ],
  },
]);
const toggle = (event: Ref) => {
  menu.value.toggle(event);
};
console.log("Fuck Info", event);
defineExpose({
  toggle,
  collapsed,
  menu,
  items,
  event,
});
</script>

<template>
  <div>
    <Toast />
    <Panel header="Header" :toggleable="true">
      <template #icons>
        <button class="p-panel-header-icon p-link mr-2" @click="toggle">
          <span class="pi pi-cog"></span>
        </button>
        <Menu id="config_menu" ref="menu" :model="items" :popup="true" />
      </template>
      <p>GODDODODOD {{ event?.title || "" }}</p>
    </Panel>
  </div>
</template>

<style lang="scss" scoped>
.p-panel p {
  line-height: 1.5;
  margin: 0;
}
</style>