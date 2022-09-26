<script setup lang='ts'>
import "@fullcalendar/core/vdom"; // solve problem with Vite
import { CalendarOptions, EventApi, DateSelectArg, EventClickArg, EventInput } from "@fullcalendar/vue3";
import Button from "primevue/button";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// @ts-ignore
import EventModalDetailVue from "@/components/EventModalDetail.vue";
// @ts-ignore
import EventModalFormVue from "@/components/EventModalForm.vue";
import { ref, h, onMounted, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useDialog } from "primevue/usedialog";
import { Auth, DataStore } from "aws-amplify";
import { useAuthenticator } from "@aws-amplify/ui-vue";
import { TOAST_ERROR_CONFIG, TOAST_SUCCESS_CONFIG } from "@/constants";
import { Events } from "@/models";
import startDataStoreConfig from "@/utils/datastore-config";
import { mapEventData } from "@/utils/event-utils";

// **** SERVICES ****
const dialog = useDialog();
const toast = useToast();
const auth = useAuthenticator();

// **** METHODS ****
const handleDateSelect = (selectInfo: DateSelectArg) => {
  dialog.open(EventModalFormVue, {
    props: {
      header: "Edit Event",
      style: "min-width: 20rem",
      closeOnEscape: true,
      modal: true,
      closable: true,
      dismissableMask: true,
    },
    data: {
      event: selectInfo,
      calendarApi: selectInfo.view.calendar,
    },
  });
  const calendarApi = selectInfo.view.calendar;

  calendarApi.unselect();
};
const handleEventClick = (clickInfo: EventClickArg) => {
  console.log(clickInfo.event);
  const viewDialogRef = dialog.open(EventModalDetailVue, {
    props: {
      header: "Event Details",
      style: "min-width: 20rem",
      footer: "border-bottom-left-radius: 1.5rem; border-bottom-right-radius: 1.5rem;",
      contentClass: "p-0",
      closable: true,
      draggable: true,
      dismissableMask: true,
      modal: true,
    },
    data: {
      event: clickInfo.event,
    },
    templates: {
      footer: () => {
        return [
          h(Button, {
            label: "Edit",
            icon: "pi pi-pencil",
            onClick: () => {
              viewDialogRef.close();
              dialog.open(EventModalFormVue, {
                props: {
                  header: "Edit Event",
                  closable: true,
                  closeOnEscape: false,
                  modal: true,
                },
                data: {
                  event: clickInfo.event,
                  calendarApi: clickInfo.view.calendar,
                },
              });
            },
          }),
          h(Button, {
            label: "Delete",
            icon: "pi pi-calendar-times",
            class: "p-button-danger",
            onClick: async () => {
              clickInfo.event.remove();
              await DataStore.delete(Events, clickInfo.event.id);
              viewDialogRef.close();
              toast.add({ ...TOAST_SUCCESS_CONFIG, detail: "Event Deleted" });
            },
          }),
        ];
      },
    },
  });
};

const handleEvents = (events: EventApi[]) => {
  currentEvents.value = events;
};
const setInitEvents = async () => {
  isFetching.value = true;
  await startDataStoreConfig();
  const events = await DataStore.query(Events);
  calendarOptions.value.events = events as EventInput[];
  isFetching.value = false;
};
const onToggleWeekend = () => {
  calendarOptions.value.weekends = !calendarOptions.value.weekends;
};
const onEventInList = (event: EventApi) => {
  dialog.open(EventModalDetailVue, {
    props: {
      header: "Event Details",
      style: "min-width: 20rem",
      contentClass: "p-0",
      closable: true,
      draggable: true,
      dismissableMask: true,
      modal: true,
    },
    data: {
      event: event,
    },
  });
};
const logout = async () => {
  isLoading.value = true;
  await Auth.signOut();
  await DataStore.clear();
  isLoading.value = false;
  window.location.reload();
};

const updateEvent = async (eventApi: EventApi) => {
  const event = mapEventData(eventApi);
  const eventRes = await DataStore.query(Events, event.id);
  if (!eventRes) return toast.add({ ...TOAST_ERROR_CONFIG, detail: "Event Not Found" });
  await DataStore.save(Events.copyOf(eventRes, (updated) => Object.assign(updated, event)));
  toast.add({ ...TOAST_SUCCESS_CONFIG, detail: "Event updated" });
};

const formatDate = (date: Date) => {
  return `${date.toLocaleTimeString()} - ${date.toISOString().split("T")[0]}`;
};

// **** STATE ****
const isLoading = ref<boolean>(false);
const isFetching = ref<boolean>(false);
const currentEvents = ref<EventApi[]>([]);
const username = computed(() => auth.user.attributes.name);
const calendarOptions = ref<CalendarOptions>({
  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin, // needed for dateClick
  ],
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  initialView: "dayGridMonth",
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  events: [],
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventsSet: handleEvents,
  eventAdd: async (addArg) => {
    const event = mapEventData(addArg.event);
    if (addArg.event.id) {
      await updateEvent(addArg.event);
      return;
    }
    await DataStore.save(new Events(event));
    toast.add({ ...TOAST_SUCCESS_CONFIG, detail: "Event Added" });
  },
  eventChange: async (updateArg) => {
    updateEvent(updateArg.event);
  },
});

// **** HOOKS ****
onMounted(async () => {
  await setInitEvents();
});
</script>

<template>
  <div class="kudos-app flex justify-content-between">
    <div class="flex h-screen w-screen" v-if="isFetching">
      <div class="m-auto">
        <Image src="logo.png" alt="logo" width="200" heigh="200" class="fadein animation-duration-3000 animation-delay-500 animation-ease-out animation-iteration-infinite" />
        <ProgressBar mode="indeterminate" style="height: 0.5em" />
      </div>
    </div>
    <template v-else>
      <Toast />
      <DynamicDialog />
      <FullCalendar class="p-3" :options="calendarOptions">
        <template #eventContent="arg">
          <template v-if="arg.timeText">
            <span :style="{ border: `1px solid ${arg.borderColor}` }">
              <b>{{ arg.event.start.toLocaleTimeString() }} {{ arg.timeText ? "" : "- " }} </b>
              <i class="white-space-nowrap overflow-hidden text-overflow-ellipsis">{{ arg.event.title }}</i>
            </span>
          </template>
          <template v-else>
            <i>{{ arg.event.title }}</i>
          </template>
        </template>
      </FullCalendar>

      <div class="kudos-sidebar border-left-1 border-cyan-100 overflow-y-auto mb-2">
        <!-- //* Profile View -->
        <div class="flex flex-row justify-content-evenly">
          <img src="logo.png" alt="logo" class="object-contain" style="min-width: 50px" width="145" height="145" />
          <div>
            <h3>{{ username }}</h3>
            <p class="font-italic white-space-nowrap overflow-hidden text-overflow-ellipsis">Calendar for Kudos 🚀</p>
            <Button label="Logout" icon="pi pi-sign-out" class="p-button-danger" @click="logout" :loading="isLoading" />
          </div>
        </div>

        <div class="px-4 pt-4 md:px-1 md:pt-1 text-sm">
          <h3>Instructions</h3>
          <ul class="m-0 py-0 px-4">
            <li class="my-2 mx-0 md:my-1 p-0">Select dates and it will popup dialog form to create a new event</li>
            <li class="my-2 mx-0 md:my-1 p-0">Drag, drop, and resize events</li>
            <li class="my-2 mx-0 md:my-1 p-0">Click on event to view it</li>
          </ul>
        </div>
        <div class="px-4 flex flex-row justify-content-start align-item-center">
          <p @click="onToggleWeekend" class="cursor-pointer">Show Weekend</p>
          <input type="checkbox" :checked="calendarOptions.weekends" @change="onToggleWeekend" />
        </div>
        <div class="px-4 pb-4">
          <h3>All Events ({{ currentEvents.length }})</h3>
          <ul class="m-0 py-0 px-4">
            <li v-for="event in currentEvents" :key="event.id">
              <b class="mr-1">{{ event.allDay ? event.startStr : formatDate(event.start) }}</b>
              <i @click="onEventInList(event)" class="cursor-pointer">{{ event.title }}</i>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang='css'  >
.kudos-app {
  min-height: 60rem;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
  margin: 0;
  padding: 0;
  background-color: #102832;
  border: 2px solid rgb(13, 84, 114);
  min-width: 30rem;
  max-height: calc(100vh - 1rem);
  min-height: 5rem;
  color: white;
}

.fc {
  /* the calendar root */
  /* max-width: 170rem; */
  width: 100%;
  min-width: 20rem;
  margin: 0 auto;
  max-height: calc(100vh - 1rem);
  min-height: 5rem;
}

.kudos-sidebar {
  padding: 1rem;
  min-width: 15rem;
  max-width: 30rem;
  max-height: calc(100vh - 1rem);
  min-height: 5rem;
}

.kudos-event-time {
  font-size: 0.8em;
  padding: 0.2em 0.5em;
  border-radius: 0.3em;
  margin-bottom: 0.2em;
  width: 15em;
}

.p-image-toolbar {
  z-index: 1000;
}
.p-progressbar .p-progressbar-value {
  background: #5271ff !important;
}
</style>
