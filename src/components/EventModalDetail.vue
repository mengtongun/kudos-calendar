<script  setup lang="ts">
import { inject, onMounted, ref, Ref } from "vue";
import { useAuthenticator } from "@aws-amplify/ui-vue";
import { Storage } from "@aws-amplify/storage";

const dialogRef = inject("dialogRef") as Ref;
const event = dialogRef.value.data.event;
const auth = useAuthenticator();
const img = ref<string>("");
const img_loading = ref<boolean>(false);
onMounted(() => {
  if (event.extendedProps?.img) {
    img_loading.value = true;
    Storage.get(event.extendedProps.img, { level: "private" }).then((res) => {
      img.value = res;
    });
  }
});
</script>

<template>
  <Card style="width: 30rem">
    <template #header>
      <div v-if="event.extendedProps?.img" class="flex flex-row item-center">
        <Image v-show="!img_loading" class="mx-auto border-round-md px-1" imagClass="w-25rem border-round-md" :src="img" :alt="event.extendedProps.img" preview @load="img_loading = false" />
        <Skeleton v-show="img_loading" class="mx-auto w-25rem h-10rem border-round-md" />
      </div>
    </template>
    <template #title>
      <div class="w-1rem h-1rem border-round inline-block" :style="{ backgroundColor: event.backgroundColor }" />
      <p class="ml-2 inline-block">
        {{ event.title }}
      </p>
    </template>
    <template #subtitle>
      <!-- create icon -->
      <div class="flex flex-row item-center">
        <i class="pi pi-user my-auto" />
        <p class="ml-2">
          {{ auth.user.attributes.name }}
        </p>
      </div>
    </template>
    <template #content>
      <!-- Date -->
      <div class="flex flex-row items-center">
        <i class="pi pi-calendar my-auto" style="font-size: 1.5rem" />
        <p class="ml-2">{{ event.startStr.split("T")[0] }} to {{ event.endStr.split("T")[0] }}</p>
      </div>
      <!-- Time -->
      <div class="flex flex-row items-center" v-if="!event.allDay">
        <i class="pi pi-clock my-auto" style="font-size: 1.5rem" />
        <p class="ml-2">{{ event.start?.toLocaleTimeString() }} <b>to</b> {{ event.end?.toLocaleTimeString() }}</p>
      </div>
      <!-- Location //TODO -->
      <!-- <div class="flex flex-row items-center">
        <i class="pi pi-map-marker my-auto" style="font-size: 1.5rem" />
        <p class="ml-2">Location</p>
      </div> -->
      <!-- Description -->
      <div class="flex flex-row items-center">
        <i class="pi pi-info-circle my-auto" style="font-size: 1.5rem" />
        <p class="ml-2">Description</p>
      </div>
      <div v-html="event.extendedProps.description"></div>
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
