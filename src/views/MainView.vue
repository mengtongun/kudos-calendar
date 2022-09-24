<script setup lang='ts'>
import "@fullcalendar/core/vdom"; // solve problem with Vite
import { CalendarOptions, EventApi, DateSelectArg, EventClickArg, EventSourceInput } from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// @ts-ignore
import EventModalDetailVue from "@/components/EventModalDetail.vue";
// @ts-ignore
import EventModalFormVue from "@/components/EventModalForm.vue";
import { ref, defineExpose, h, onBeforeMount, onUpdated } from "vue";
import { useToast } from "primevue/usetoast";
import { useDialog } from "primevue/usedialog";
import Button from "primevue/button";
import { useStore } from "vuex";
import { Auth, DataStore } from "aws-amplify";
import { useAuthenticator } from "@aws-amplify/ui-vue";
import { Events } from "@/models";

const commonDialogConfig = {
  closable: true,
  closeOnEscape: false,
  modal: true,
};

// Services
const dialog = useDialog();
const toast = useToast();
const store = useStore();
const auth = useAuthenticator();

// Methods
const handleDateSelect = (selectInfo: DateSelectArg) => {
  dialog.open(EventModalFormVue, {
    props: {
      header: "Edit Event",
      ...commonDialogConfig,
      closeOnEscape: true,
      modal: true,
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
          h(
            Button,
            {
              label: "Edit",
              icon: "pi pi-pencil",
              onClick: () => {
                viewDialogRef.close();
                dialog.open(EventModalFormVue, {
                  props: {
                    header: "Edit Event",
                    ...commonDialogConfig,
                  },
                  data: {
                    event: clickInfo.event,
                    calendarApi: clickInfo.view.calendar,
                  },
                });
              },
            },
            {}
          ),
          h(
            Button,
            {
              label: "Delete",
              icon: "pi pi-trash",
              class: "p-button-danger",
              onClick: () => {
                toast.add({ severity: "warn", summary: "Delete", detail: "Data Deleted", life: 3000 });
              },
            },
            {}
          ),
        ];
      },
    },
  });

  // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
  //   clickInfo.event.remove();
  // }
};
const handleEvents = (events: EventApi[]) => {
  currentEvents.value = events;
};
const setInitEvents = async () => {
  is_fetching.value = true;
  const events = await DataStore.query(Events);
  calendarOptions.value.initialEvents = events as any;
  is_fetching.value = false;
};

onBeforeMount(() => {
  setInitEvents();
});

onUpdated(() => {
  console.log("event", store.state.events);
});
// State
const is_loading = ref<boolean>(false);
const is_fetching = ref<boolean>(false);
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
  initialEvents: [], // alternatively, use the `events` setting to fetch from a feed
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventsSet: handleEvents,
  eventAdd: async (event) => {
    is_loading.value = true;
  },
  eventChange: async (event) => {
    console.log("event change", event);
  },
  /* you can update a remote database when these fire:
        eventAdd:
        eventChange:
        eventRemove:
        */
});
const currentEvents = ref<EventApi[]>([]);
const handleWeekendsToggle = () => {
  calendarOptions.value.weekends = !calendarOptions.value.weekends; // update a property
};
const logout = async () => {
  is_loading.value = true;
  await Auth.signOut();
  is_loading.value = false;
  window.location.reload();
};

import Skeleton from "primevue/skeleton";
</script>

<template>
  <div class="kudos-app">
    <Skeleton v-if="is_fetching" />
    <template v-else>
      <Toast />
      <DynamicDialog />
      <div class="kudos-app-main">
        <FullCalendar class="kudos-app-calendar" :options="calendarOptions">
          <template #eventContent="arg">
            <b>{{ arg.timeText }}</b>
            <i>{{ arg.event.title }}</i>
          </template>
        </FullCalendar>
      </div>
      <div class="kudos-app-sidebar">
        <!-- //* Profile View -->
        <div class="flex flex-row justify-content-evenly">
          <div class="block">
            <div>
              <img src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" alt="" />
            </div>
            <div>
              <h3>{{ auth.user.attributes.name }}</h3>
              <p>Software Engineer</p>
            </div>
          </div>
          <Button label="Logout" icon="pi pi-sign-out" class="p-button-danger border-round-lg" @click="logout" :loading="is_loading" />
        </div>

        <div class="px-4 pt-4">
          <h2>Instructions</h2>
          <ul>
            <li>Select dates and you will be prompted to create a new event</li>
            <li>Drag, drop, and resize events</li>
            <li>Click an event to delete it</li>
          </ul>
        </div>
        <div class="px-4 flex flex-row justify-content-start align-item-center">
          <p class="">Show Weekend</p>
          <input type="checkbox" :checked="calendarOptions.weekends" @change="handleWeekendsToggle" />
        </div>
        <div class="p-4">
          <h2>All Events ({{ currentEvents.length }})</h2>
          <ul>
            <li v-for="event in currentEvents" :key="event.id">
              <b>{{ event.startStr }}</b>
              <i>{{ event.title }}</i>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang='css' scoped>
h2 {
  margin: 0;
  font-size: 16px;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

li {
  margin: 1.5em 0;
  padding: 0;
}

b {
  /* used for event dates/times */
  margin-right: 3px;
}

.kudos-app {
  display: flex;
  min-height: 100%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}

.kudos-app-sidebar {
  width: 300px;
  line-height: 1.5;
  background: #143340;
  border-left: 1px solid #ccc;
}

.kudos-app-main {
  flex-grow: 1;
  padding: 3em;
}

.fc {
  /* the calendar root */
  max-width: 1100px;
  margin: 0 auto;
}
</style>
