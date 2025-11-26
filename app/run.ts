import { getAlertMessage } from "../features/internet-alert/index.js";
import { getUpdates, deleteMessage, sendMessage } from "../shared/tg-api.js";
import {
  readOffset,
  updateOffset,
  createUser,
  getUsers,
} from "../shared/firebase.js";

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
      createUser({
        id: String(userId), // TODO: firecloud -> to number
        chatId: String(chatId), // TODO: firecloud -> to number
        firstName,
        lastName,
        userName,
      }),
      deleteMessage(chatId, messageId),
    ]);

    offsetNew++;
  }

  if (alertMessage != null) {
    const users = await getUsers();

    for (const user of users) {
      // TODO: user check verifyed flag
      await sendMessage(
        Number(user.chatId), // TODO: firecloud -> to number
        alertMessage
      );
    }
  }

  await updateOffset(offsetNew);
};

run();
