import { EventApi } from "@fullcalendar/core";

export type EventApiData = EventApi & {
	description: string;
};
