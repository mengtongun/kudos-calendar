import { EventInput } from "@fullcalendar/vue3";

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
