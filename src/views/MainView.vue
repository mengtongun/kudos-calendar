<script setup lang='ts'>
import "@fullcalendar/core/vdom"; // solve problem with Vite
import { CalendarOptions, EventApi, DateSelectArg, EventClickArg } from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from "../utils/event-utils";
// @ts-ignore
import EventModalDetailVue from "@/components/EventModalDetail.vue";
// @ts-ignore
import EventModalFormVue from "@/components/EventModalForm.vue";
import { ref, defineExpose, h, onBeforeMount } from "vue";
import { useToast } from "primevue/usetoast";
import { useDialog } from "primevue/usedialog";
import Button from "primevue/button";
import { useStore } from "vuex";

const commonDialogConfig = {
  closable: true,
  closeOnEscape: false,
  modal: true,
};

// Services
const dialog = useDialog();
const toast = useToast();
const store = useStore();

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
    },
  });
  const calendarApi = selectInfo.view.calendar;

  calendarApi.unselect(); // clear date selection

  // if (title) {
  //   calendarApi.addEvent({
  //     id: createEventId(),
  //     title,
  //     start: selectInfo.startStr,
  //     end: selectInfo.endStr,
  //     allDay: selectInfo.allDay,
  //   });
  // }
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
          //  Edit and Delete Button
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
store.dispatch("fetchEvents");

console.log("event", store.state.events);
// State
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
  initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventsSet: handleEvents,
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

defineExpose({
  handleWeekendsToggle,
  handleDateSelect,
  handleEventClick,
  handleEvents,
  calendarOptions,
  currentEvents,
});
</script>

<template>
  <div class="kudos-app">
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
      <div class="kudos-app-sidebar-section">
        <h2>Instructions</h2>
        <ul>
          <li>Select dates and you will be prompted to create a new event</li>
          <li>Drag, drop, and resize events</li>
          <li>Click an event to delete it</li>
        </ul>
      </div>
      <div class="kudos-app-sidebar-section">
        <label>
          <input type="checkbox" :checked="calendarOptions.weekends" @change="handleWeekendsToggle" />
          toggle weekends
        </label>
      </div>
      <div class="kudos-app-sidebar-section">
        <h2>All Events ({{ currentEvents.length }})</h2>
        <ul>
          <li v-for="event in currentEvents" :key="event.id">
            <b>{{ event.startStr }}</b>
            <i>{{ event.title }}</i>
          </li>
        </ul>
      </div>
    </div>
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

.kudos-app-sidebar-section {
  padding: 2em;
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
