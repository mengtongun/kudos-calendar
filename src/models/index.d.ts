import { ModelInit, MutableModel } from "@aws-amplify/datastore";

export enum StatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED"
}

export declare class Events {
  readonly id: string;
  readonly status: StatusEnum | keyof typeof StatusEnum;
  readonly title: string;
  readonly url?: string | null;
  readonly start: string;
  readonly end: string;
  readonly allDay: boolean;
  readonly classNames?: string | null;
  readonly backgroundColor?: string | null;
  readonly borderColor?: string | null;
  readonly textColor?: string | null;
  readonly img?: string | null;
  readonly description?: string | null;
  readonly updatedAt?: string | null;
  readonly createdAt?: string | null;
  constructor(init: ModelInit<Events>);
  static copyOf(source: Events, mutator: (draft: MutableModel<Events>) => MutableModel<Events> | void): Events;
}