import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";

export enum StatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED"
}

type EagerEvents = {
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
}

type LazyEvents = {
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
}

export declare type Events = LazyLoading extends LazyLoadingDisabled ? EagerEvents : LazyEvents

export declare const Events: (new (init: ModelInit<Events>) => Events) & {
  copyOf(source: Events, mutator: (draft: MutableModel<Events>) => MutableModel<Events> | void): Events;
}