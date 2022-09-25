import {
	FORM_DEFAULT_BORDER_COLOR,
	FORM_DEFAULT_TEXT_COLOR,
} from "./../constants/index";
import { FORM_DEFAULT_BG_COLOR } from "@/constants";
import { StatusEnum } from "./../models/index.d";
import { EventApi } from "@fullcalendar/core";

export const mapEventData = (event: EventApi) => {
	return {
		status: StatusEnum.ACTIVE,
		title: event.title,
		url: "",
		start: event.start?.toISOString() || new Date().toISOString(), // will delete after finished other part
		end: event.end?.toISOString() || new Date().toISOString(),
		allDay: event.allDay,
		backgroundColor: event.backgroundColor || FORM_DEFAULT_BG_COLOR,
		borderColor: event.borderColor || FORM_DEFAULT_BORDER_COLOR,
		textColor: event.textColor || FORM_DEFAULT_TEXT_COLOR,
		updatedAt: new Date().toISOString(),
		...event.extendedProps,
	};
};
