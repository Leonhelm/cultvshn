import { getAlertMessage } from "../features/internet-alert/index.js";
import { getUpdates, deleteMessage, sendMessage } from "../shared/tg-api.js";
import { readOffset, updateOffset, createUser } from "../shared/firebase.js";

const run = async () => {
  const offset = (await readOffset()) ?? 0;
  let offsetNew = offset;

  const [alertMessage, updates] = await Promise.all([
    getAlertMessage(),
    getUpdates(offset),
  ]);

  for (const update of updates) {
    const { messageId, userId, chatId, firstName, lastName, userName } = update;

    await Promise.all([
      createUser({ id: userId, chatId, firstName, lastName, userName }),
      deleteMessage(chatId, messageId),
    ]);

    offsetNew++;
  }

  // if (alertMessage != null) {
  // TODO: await getUsers, check verifyed user field and await sendMessage(chatId, alertMessage);
  // }

  await updateOffset(offsetNew);
};

run();
