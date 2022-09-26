<script  setup lang="ts">
import { computed, inject, onMounted, ref, Ref } from "vue";
import { useAuthenticator } from "@aws-amplify/ui-vue";
import { Storage } from "@aws-amplify/storage";

const dialogRef = inject("dialogRef") as Ref;
const event = dialogRef.value.data.event;
const auth = useAuthenticator();
const img = ref<string>("");
const imgLoading = ref<boolean>(false);

// **** COMPUTED ****
const username = computed(() => auth.user.attributes.name);
const startLocalTime = computed(() => event.start.toLocaleTimeString());
const endLocalTime = computed(() => event.end.toLocaleTimeString());
const startLocalDate = computed(() => event.startStr.split("T")[0]);
const endLocalDate = computed(() => event.endStr.split("T")[0]);
const description = computed(() => event.extendedProps.description);
const imgKey = computed(() => event.extendedProps.img);

onMounted(() => {
  if (event.extendedProps?.img) {
    imgLoading.value = true;
    Storage.get(event.extendedProps.img, { level: "private" }).then((res) => {
      img.value = res;
    });
  }
});
</script>

<template>
  <Card style="min-width: 20rem">
    <template #header>
      <div v-if="imgKey" class="flex flex-row item-center">
        <Image v-show="!imgLoading" class="mx-auto border-round-md px-1" imagClass="w-full border-round-md" :src="img" :alt="imgKey" preview @load="imgLoading = false" />
        <Skeleton v-show="imgLoading" class="mx-auto w-28rem h-10rem border-round-md" />
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
          {{ username }}
        </p>
      </div>
    </template>
    <template #content>
      <!-- Date -->
      <div class="flex flex-row items-center">
        <i class="pi pi-calendar my-auto" style="font-size: 1.5rem" />
        <p class="ml-2">{{ startLocalDate }} to {{ endLocalDate }}</p>
      </div>
      <!-- Time -->
      <div class="flex flex-row items-center" v-if="!event.allDay">
        <i class="pi pi-clock my-auto" style="font-size: 1.5rem" />
        <p class="ml-2">{{ startLocalTime }} <b>to</b> {{ endLocalTime }}</p>
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
      <div v-if="description">
        <div class="m-2" v-html="description"></div>
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
