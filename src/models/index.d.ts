import { ModelInit, MutableModel } from "@aws-amplify/datastore";

export enum StatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED"
}

type UserLogsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}



export declare class UserLogs {
  readonly id: string;
  readonly UID: string;
  readonly loginAt?: number | null;
  readonly logoutAt?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<UserLogs, UserLogsMetaData>);
  static copyOf(source: UserLogs, mutator: (draft: MutableModel<UserLogs, UserLogsMetaData>) => MutableModel<UserLogs, UserLogsMetaData> | void): UserLogs;
}

export declare class Events {
  readonly id: string;
  readonly status: StatusEnum | keyof typeof StatusEnum;
  readonly title: string;
  readonly description?: string | null;
  readonly url?: string | null;
  readonly start: string;
  readonly end: string;
  readonly allDay: boolean;
  readonly classNames?: string | null;
  readonly editable?: boolean | null;
  readonly startEditable?: boolean | null;
  readonly durationEditable?: boolean | null;
  readonly resourceEditable?: boolean | null;
  readonly display?: string | null;
  readonly overlap?: boolean | null;
  readonly constraint?: string | null;
  readonly backgroundColor?: string | null;
  readonly borderColor?: string | null;
  readonly textColor?: string | null;
  readonly extendedProps?: string | null;
  readonly source?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly groupId?: string | null;
  constructor(init: ModelInit<Events>);
  static copyOf(source: Events, mutator: (draft: MutableModel<Events>) => MutableModel<Events> | void): Events;
}