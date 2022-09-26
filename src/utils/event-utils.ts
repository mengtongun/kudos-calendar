import {
	FORM_DEFAULT_BG_COLOR,
	FORM_DEFAULT_BORDER_COLOR,
	FORM_DEFAULT_TEXT_COLOR,
} from "./../constants/index";
import { EventApi } from "@fullcalendar/core";
import { Events, StatusEnum } from "@/models";

export const mapEventData = (event: EventApi): Events => {
	return {
		id: event.id,
		status: StatusEnum.ACTIVE,
		title: event.title,
		url: "",
		start: event.start?.toISOString() || new Date().toISOString(), // will delete after finished other part
		end: event.end?.toISOString() || new Date().toISOString(),
		allDay: event.allDay,
		backgroundColor: event.backgroundColor || FORM_DEFAULT_BG_COLOR,
		borderColor: event.borderColor || FORM_DEFAULT_BORDER_COLOR,
		textColor: event.textColor || FORM_DEFAULT_TEXT_COLOR,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		...event.extendedProps,
	};
};
