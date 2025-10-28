const TG_BOT_API_TOKEN = process.env.TG_BOT_API_TOKEN;
const API = `https://api.telegram.org/bot${TG_BOT_API_TOKEN}`;

let offset = 0;

const getUpdates = async () => {
  const res = await fetch(`${API}/getUpdates?timeout=30&offset=${offset}`);
  const data = await res.json();
  return data.result;
};

const sendMessage = async (chatId, text) => {
  await fetch(`${API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
};

const deleteMessage = async (chatId, messageId) => {
  const res = await fetch(`${API}/deleteMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId }),
  });
  return res.json();
};

const run = async () => {
  const updates = await getUpdates();

  for (const update of updates) {
    const { update_id: updateId, message } = update;
    const { message_id: messageId, from, chat, date, text } = message;
    const { id: userId } = from;
    const {
      id: chatId,
      first_name: firstName,
      last_name: lastName,
      username,
    } = chat;

    await deleteMessage(chatId, messageId);
  }
};

await run();
