// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const StatusEnum = {
  "ACTIVE": "ACTIVE",
  "INACTIVE": "INACTIVE",
  "DELETED": "DELETED"
};

const { UserLogs, Events } = initSchema(schema);

export {
  UserLogs,
  Events,
  StatusEnum
};