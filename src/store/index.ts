import {
	FORM_DEFAULT_TEXT_COLOR,
	FORM_DEFAULT_BORDER_COLOR,
} from "./../constants/index";
import { FORM_DEFAULT_BG_COLOR } from "@/constants";
import { Events, StatusEnum } from "@/models";
import { EventApiData } from "@/types";
import { DataStore } from "aws-amplify";
import { createStore } from "vuex";

declare type UserInfo = {
	id: string;
	name: string;
	email: string;
};

export default createStore({
	state: { events: [] as Events[], userInfo: {} as UserInfo },
	getters: {
		getEvents: (state) => state.events,
	},
	mutations: {
		ADD_EVENT(state, event) {
			state.events.push(event);
		},
		DEL_EVENT(state, event) {
			state.events = state.events.filter((e) => e.id !== event.id);
		},
		UPDATE_EVENT(state, event) {
			state.events = state.events.map((e) => {
				if (e.id === event.id) {
					return event;
				} else {
					return e;
				}
			});
		},
	},
	actions: {
		async fetchEvents({ commit, state }) {
			const events = await DataStore.query(Events);
			state.events = events.filter((e) => e.status === StatusEnum.ACTIVE);
			console.log("events", events);
		},
		addEvent({ commit }, event: EventApiData) {
			commit("ADD_EVENT", event);
			const data = {
				status: StatusEnum.ACTIVE,
				title: event.title,
				description: event.description || "",
				url: "",
				start: event.start?.toISOString() || new Date().toISOString(), // will delete after finished other part
				end: event.end?.toISOString() || new Date().toISOString(),
				allDay: event.allDay,
				classNames: "", // todo new feature on UI
				editable: true,
				startEditable: true,
				durationEditable: true,
				resourceEditable: true,
				display: "",
				overlap: true,
				constraint: "",
				backgroundColor: event.backgroundColor || FORM_DEFAULT_BG_COLOR,
				borderColor: event.borderColor || FORM_DEFAULT_BORDER_COLOR,
				textColor: event.textColor || FORM_DEFAULT_TEXT_COLOR,
				extendedProps: "",
				source: "",
				groupId: event.groupId || "",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
			return new Promise((resolve, reject) => {
				DataStore.save(new Events(data))
					.then((res) => {
						resolve(res);
					})
					.catch((err) => {
						console.log("ADD_EVENT network error", err);
						reject(err);
					});
			});
		},
		delEvent({ commit }, event) {
			commit("DEL_EVENT", event);
			return new Promise((resolve, reject) => {
				DataStore.delete(Events, event.id)
					.then((res) => {
						resolve(res);
					})
					.catch((err) => {
						console.log("DEL_EVENT network error", err);
						reject(err);
					});
			});
		},
		async updateEvent({ commit }, event) {
			const eventRes = await DataStore.query(Events, event.id);
			if (!eventRes) return new Error("Event not found");

			const data = {
				status: StatusEnum.ACTIVE,
				title: event.title,
				description: event.description || "",
				url: "",
				start: event.start?.toISOString() || new Date().toISOString(), // will delete after finished other part
				end: event.end?.toISOString() || new Date().toISOString(),
				allDay: event.allDay,
				classNames: "", // todo new feature on UI
				editable: true,
				startEditable: true,
				durationEditable: true,
				resourceEditable: true,
				display: "",
				overlap: true,
				constraint: "",
				backgroundColor: event.backgroundColor || FORM_DEFAULT_BG_COLOR,
				borderColor: event.borderColor || FORM_DEFAULT_BORDER_COLOR,
				textColor: event.textColor || FORM_DEFAULT_TEXT_COLOR,
				extendedProps: "",
				source: "",
				groupId: event.groupId || "",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
			return new Promise((resolve, reject) => {
				DataStore.save(
					Events.copyOf(eventRes, (updated) => Object.assign(updated, data))
				)
					.then((res) => {
						resolve(res);
					})
					.catch((err) => {
						console.log("UPDATE_EVENT network error", err);
						reject(err);
					});
			});
		},
	},
	modules: {},
});
