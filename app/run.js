import { getAlertMessage } from "../features/internet-alert/index.js";
import { getUpdates, deleteMessage, sendMessage } from "../shared/tg-api.js";
import {
  readOffset,
  updateOffset,
  createChat,
  getChats,
} from "../shared/firebase.js";
import { happenedWithinLastDay } from "../shared/datetime.ts";

const run = async () => {
  const offset = (await readOffset()) ?? 0;
  let offsetNew = offset;

  const [alertMessage, updates, chats] = await Promise.all([
    getAlertMessage(),
    getUpdates(offset + 1),
    getChats(),
  ]);

  for (const update of updates) {
    const {
      messageId,
      userId,
      chatId,
      firstName,
      lastName,
      userName,
      updateId,
      date,
    } = update;

    const promises = [
      // deleteMessage(chatId, messageId)
    ];

    if (!chats.has(chatId)) {
      const chat = {
        chatId,
        userId,
        userName,
        firstName,
        lastName,
      };
      promises.push(createChat(chat));
      chats.set(chatId, chat);
    }

    await Promise.all(promises);

    offsetNew = updateId;
  }

  if (alertMessage != null) {
    const promises = [];

    chats.forEach((_chat, chatId) => {
      // TODO: chat check verifyed flag
      promises.push(sendMessage(chatId, alertMessage));
    });

    await Promise.all(promises);
  }

  await updateOffset(offsetNew);
};

run();
