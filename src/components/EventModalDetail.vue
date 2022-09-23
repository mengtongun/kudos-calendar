<script setup lang="ts">
import { Ref } from "@vue/runtime-core";
import { inject, ref, onBeforeMount, defineExpose } from "vue";
import { EventApi } from "@fullcalendar/vue3";
import { useAuthenticator } from "@aws-amplify/ui-vue";

// State
const event = ref<EventApi | undefined>(undefined);

// Service
const auth = useAuthenticator();
onBeforeMount(() => {
  // const dialogRef = inject("dialogRef") as Ref;
  // event.value = dialogRef.value.data.event;
  event.value = {
    id: "1",
    title: "Date with honey",
    start: new Date(),
    end: new Date(),
    startStr: "2021-09-01",
    endStr: "2021-09-01",
    allDay: true,
    backgroundColor: "red",
    borderColor: "white",
    textColor: "white",
    extendedProps: {
      // image: "https://www.primefaces.org/wp-content/uploads/2020/02/primefacesorg-primevue-2020.png",
    } as unknown,
  } as EventApi;
});

defineExpose({
  event,
  auth,
});
</script>

<template>
  <Card style="width: 30rem">
    <template #header v-if="event.extendedProps?.image">
      <div class="flex flex-row item-center">
        <img class="mx-auto w-25rem" :src="event.extendedProps?.image" alt="event_img" />
      </div>
    </template>
    <template #title>
      <div class="w-1rem h-1rem border-round inline-block" :style="{ backgroundColor: event.backgroundColor }"></div>
      <p class="ml-2 inline-block">{{ event.title }}</p>
    </template>
    <template #subtitle>
      <!-- create icon -->
      <div class="flex flex-row item-center">
        <i class="pi pi-user my-auto"></i>
        <p class="ml-2">{{ auth.user.attributes.name }}</p>
      </div>
    </template>
    <template #content>
      <!-- Date -->
      <div class="flex flex-row items-center">
        <i class="pi pi-calendar my-auto" style="font-size: 1.5rem"></i>
        <p class="ml-2">{{ event.startStr }} - {{ event.endStr }}</p>
      </div>
      <!-- Time -->
      <div class="flex flex-row items-center">
        <i class="pi pi-clock my-auto" style="font-size: 1.5rem"></i>
        <p class="ml-2">{{ event.startStr }} - {{ event.endStr }}</p>
      </div>
      <!-- Location -->
      <div class="flex flex-row items-center">
        <i class="pi pi-map-marker my-auto" style="font-size: 1.5rem"></i>
        <p class="ml-2">Location</p>
      </div>
      <!-- Description -->
      <div class="flex flex-row items-center">
        <i class="pi pi-info-circle my-auto" style="font-size: 1.5rem"></i>
        <p class="ml-2">Description</p>
      </div>
    </template>
  </Card>
</template>

<style lang="scss" scoped>
.p-card,
.p-card-body,
.p-card-header,
.p-card-footer,
.p-card-title,
.p-card-subtitle {
  padding: 1rem;
}
</style>