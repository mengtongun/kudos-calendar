import {
	FORM_DEFAULT_BG_COLOR,
	FORM_DEFAULT_BORDER_COLOR,
	FORM_DEFAULT_TEXT_COLOR,
} from "./../constants/index";
import { EventApi } from "@fullcalendar/core";
import { Events, StatusEnum } from "@/models";
import { EventInput } from "@fullcalendar/vue3";

export const mapEventData = (event: EventApi): Events => {
	return {
		id: event.id,
		status: StatusEnum.ACTIVE,
		title: event.title,
		url: "",
		start: event.start?.toISOString() || new Date().toISOString(), // will delete after finished other part
		end: event.end?.toISOString() || new Date().toISOString(),
		allDay: event.allDay,
		classNames: event.classNames.join(","), // todo new feature on UI
		backgroundColor: event.backgroundColor || FORM_DEFAULT_BG_COLOR,
		borderColor: event.borderColor || FORM_DEFAULT_BORDER_COLOR,
		textColor: event.textColor || FORM_DEFAULT_TEXT_COLOR,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		...event.extendedProps,
	};
};
let eventGuid = 0;
const todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
	{
		id: createEventId(),
		title: "All-day event",
		start: todayStr,
		backgroundColor: "red",
		borderColor: "white",
		textColor: "white",
	},
	{
		id: createEventId(),
		title: "Timed event",
		start: todayStr + "T12:00:00",
	},
];

export function createEventId() {
	return String(eventGuid++);
}
