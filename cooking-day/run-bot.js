import { getUpdates, deleteMessage } from "../shared/tg-api.js";

const run = async () => {
  const updates = await getUpdates();

  for (const update of updates) {
    const { chatId, messageId } = update;

    await deleteMessage(chatId, messageId);
  }
};

await run();
