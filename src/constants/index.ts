// * DEFAULT VALUE FOR EVENT FORM
export const FORM_DEFAULT_BG_COLOR = "#3f51b5";
export const FORM_DEFAULT_BORDER_COLOR = "#3f51b5";
export const FORM_DEFAULT_TEXT_COLOR = "#ffffff";
export const TOAST_ERROR_CONFIG = {
	severity: "error",
	summary: "Error",
	detail: "Error Message",
	life: 3000,
};
export const TOAST_SUCCESS_CONFIG = {
	severity: "success",
	summary: "Success",
	detail: "Success Message",
	life: 3000,
};
export const Mutates = {
	ADD_EVENT: "ADD_EVENT",
	DEL_EVENT: "DEL_EVENT",
	UPDATE_EVENT: "UPDATE_EVENT",
};

export const Actions = {
	fetchEvents: "fetchEvents",
	addEvent: "addEvent",
	delEvent: "delEvent",
	updateEvent: "updateEvent",
};
