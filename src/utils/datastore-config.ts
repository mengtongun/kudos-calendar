import { DataStore } from "@aws-amplify/datastore";
import { Hub } from "aws-amplify/utils";

export default async function startDataStoreConfig() {
  DataStore.configure();
  await DataStore.clear();
  await DataStore.start();
  await waitForDataStoreLoad();
}

const waitForDataStoreLoad = async () => {
  await new Promise<void>((resolve) => {
    Hub.listen("datastore", async (hubData) => {
      const { event } = hubData.payload;
      if (event === "ready") {
        resolve();
      }
    });
  });
};
