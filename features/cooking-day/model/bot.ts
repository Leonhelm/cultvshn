import { getUpdates, deleteMessage } from "../../../shared/tg-api.js";

export const bot = async () => {
  const updates = await getUpdates();

  for (const update of updates) {
    const { chatId, messageId } = update;

    await deleteMessage(chatId, messageId);
  }
};
