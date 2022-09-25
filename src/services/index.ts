import { mapEventData } from "./utils";
import { Events, StatusEnum } from "@/models";
import { DataStore } from "aws-amplify";
import { EventApi, EventInput } from "@fullcalendar/core";

export const fetchEvents = async () => {
	const events = await DataStore.query(Events);
	return events.filter((e) => e.status === StatusEnum.ACTIVE) as EventInput[];
};

export const addEvent = async (event: EventApi) => {
	const data = {
		...mapEventData(event),
		createdAt: new Date().toISOString(),
	};
	return await DataStore.save(new Events(data));
};

export const delEvent = async (event: EventApi) => {
	return await DataStore.delete(Events, event.id);
};

export const updateEvent = async (event: EventApi) => {
	const eventRes = await DataStore.query(Events, event.id);
	if (!eventRes) return new Error("Event not found");
	await DataStore.save(
		Events.copyOf(eventRes, (updated) =>
			Object.assign(updated, mapEventData(event))
		)
	);
};
