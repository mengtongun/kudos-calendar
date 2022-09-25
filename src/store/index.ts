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
	mutations: {},
	actions: {
		async fetchEvents({ commit, state }) {
			const events = await DataStore.query(Events);
			state.events = events.filter((e) => e.status === StatusEnum.ACTIVE);
			return events;
			console.log("events", events);
		},
		addEvent({ commit }, event: EventApiData) {
			const data = {
				status: StatusEnum.ACTIVE,
				title: event.title,
				url: "",
				start: event.start?.toISOString() || new Date().toISOString(), // will delete after finished other part
				end: event.end?.toISOString() || new Date().toISOString(),
				allDay: event.allDay,
				classNames: event.classNames.join(","), // todo new feature on UI
				constraint: event.constraint?.toString() || "",
				backgroundColor: event.backgroundColor || FORM_DEFAULT_BG_COLOR,
				borderColor: event.borderColor || FORM_DEFAULT_BORDER_COLOR,
				textColor: event.textColor || FORM_DEFAULT_TEXT_COLOR,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				...event.extendedProps,
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
				start: event.start?.toISOString() || new Date().toISOString(), // will delete after finished other part
				end: event.end?.toISOString() || new Date().toISOString(),
				allDay: event.allDay,
				classNames: event.classNames.join(","), // todo new feature on UI
				backgroundColor: event.backgroundColor || FORM_DEFAULT_BG_COLOR,
				borderColor: event.borderColor || FORM_DEFAULT_BORDER_COLOR,
				textColor: event.textColor || FORM_DEFAULT_TEXT_COLOR,
				updatedAt: new Date().toISOString(),
				...event.extendedProps,
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
