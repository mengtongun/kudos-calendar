<script setup lang='ts'>
import "@fullcalendar/core/vdom"; // solve problem with Vite
import { CalendarOptions, EventApi, DateSelectArg, EventClickArg } from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// @ts-ignore
import EventModalDetailVue from "@/components/EventModalDetail.vue";
// @ts-ignore
import EventModalFormVue from "@/components/EventModalForm.vue";
import { ref, h, onBeforeMount, onUpdated, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useDialog } from "primevue/usedialog";
import Button from "primevue/button";
import { useStore } from "vuex";
import { Auth } from "aws-amplify";
import { useAuthenticator } from "@aws-amplify/ui-vue";
import { TOAST_SUCCESS_CONFIG } from "@/constants";

// **** SERVICES ****
const dialog = useDialog();
const toast = useToast();
const store = useStore();
const auth = useAuthenticator();

// **** METHODS ****
const handleDateSelect = (selectInfo: DateSelectArg) => {
  dialog.open(EventModalFormVue, {
    props: {
      header: "Edit Event",
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
      style: "width: 30rem",
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
            icon: "pi pi-trash",
            class: "p-button-danger",
            onClick: () => {
              store.dispatch("delEvent", clickInfo.event);
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
  is_fetching.value = true;
  await store.dispatch("fetchEvents");
  calendarOptions.value.events = events.value;
  is_fetching.value = false;
};
const onToggleWeekend = () => {
  calendarOptions.value.weekends = !calendarOptions.value.weekends; // update a property
};
const onEventInList = (event: EventApi) => {
  dialog.open(EventModalDetailVue, {
    props: {
      header: "Event Details",
      style: "width: 30rem",
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
// **** State ****
const is_loading = ref<boolean>(false);
const is_fetching = ref<boolean>(false);
const currentEvents = ref<EventApi[]>([]);
const events = computed(() => store.state.events);
const userName = computed(() => auth.user.attributes.name);
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
  initialEvents: [],
  events: [],
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventsSet: handleEvents,
  // eventAdd: async (event) => {
  //   if (event.event.id) {
  //     await store.dispatch("updateEvent", event.event);
  //     toast.add({ ...TOAST_SUCCESS_CONFIG, detail: "Event updated" });
  //     return;
  //   }
  //   await store.dispatch("addEvent", event.event);
  //   toast.add({ ...TOAST_SUCCESS_CONFIG, detail: "Event Added" });
  // },
  // eventChange: async (event) => {
  //   await store.dispatch("updateEvent", event.event);
  //   toast.add({ ...TOAST_SUCCESS_CONFIG, detail: "Event updated" });
  // },
});

const logout = async () => {
  is_loading.value = true;
  await Auth.signOut();
  is_loading.value = false;
  window.location.reload();
};
// **** HOOKS ****
onBeforeMount(() => {
  setInitEvents();
});

onUpdated(() => {
  console.log("event", store.state.events);
});
</script>

<template>
  <div class="kudos-app flex justify-content-between">
    <div class="m-auto" v-if="is_fetching">
      <Image src="logo.png" alt="logo" width="200" heigh="200" class="fadein animation-duration-3000 animation-delay-500 animation-ease-out animation-iteration-infinite" />
      <ProgressBar mode="indeterminate" style="height: 0.5em" />
    </div>

    <template v-else>
      <Toast />
      <DynamicDialog />
      <FullCalendar class="p-3" :options="calendarOptions">
        <template #eventContent="arg">
          <!-- // TODO: Phase 2 -->
          <template v-if="!arg.textTime">
            <b>{{ arg.event.start.toLocaleTimeString() }} - </b>
            <i>{{ arg.event.title }}</i>
          </template>
          <i v-else>{{ arg.event.title }}</i>
          <pre>{{ arg }}</pre>
        </template>
      </FullCalendar>

      <div class="kudos-sidebar border-left-1 border-cyan-100">
        <!-- //* Profile View -->
        <div class="flex flex-row justify-content-evenly">
          <div>
            <img src="logo.png" alt="logo" width="145" height="145" />
          </div>
          <div>
            <h3>{{ userName }}</h3>
            <p class="font-italic">Calendar for Kudos 🚀</p>
            <Button label="Logout" icon="pi pi-sign-out" class="p-button-danger" @click="logout" :loading="is_loading" />
          </div>
        </div>

        <div class="px-4 pt-4">
          <h3>Instructions</h3>
          <ul class="m-0 py-0 px-4">
            <li class="my-2 mx-0 p-0">Select dates and you will be prompted to create a new event</li>
            <li class="my-2 mx-0 p-0">Drag, drop, and resize events</li>
            <li class="my-2 mx-0 p-0">Click an event to delete it</li>
          </ul>
        </div>
        <div class="px-4 flex flex-row justify-content-start align-item-center">
          <p class="">Show Weekend</p>
          <input type="checkbox" :checked="calendarOptions.weekends" @change="onToggleWeekend" />
        </div>
        <div class="px-4 pb-4">
          <h3>All Events ({{ currentEvents.length }})</h3>
          <ul class="m-0 py-0 px-4 h-26rem overflow-y-auto">
            <li v-for="event in currentEvents" :key="event.id">
              <b class="mr-1">{{ event.startStr }}</b>
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
  display: flex;
  min-height: 60rem;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
  margin: 0;
  padding: 0;
  background-color: #102832;
  border: 2px solid rgb(13, 84, 114);
  max-width: 200rem;
  min-width: 100rem;
}
.fc {
  /* the calendar root */
  max-width: 170rem;
  min-width: 80rem;
  margin: 0 auto;
  min-height: 40rem;
  max-height: 56rem;
}
.kudos-sidebar {
  flex: 1;
  padding: 1rem;
  min-width: 20rem;
  max-width: 30rem;
  min-height: 56rem;
  max-height: 100vw;
}

.p-image-toolbar {
  z-index: 1000;
}
.p-dialog-header {
  border-bottom: 1px solid #ffffff;
}
.kudos-event-time {
  font-size: 0.8em;
  padding: 0.2em 0.5em;
  border-radius: 0.3em;
  margin-bottom: 0.2em;
  width: 15em;
}
</style>
