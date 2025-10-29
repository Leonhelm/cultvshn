const TG_BOT_API_TOKEN = process.env.TG_BOT_API_TOKEN;
const API = `https://api.telegram.org/bot${TG_BOT_API_TOKEN}`;

let offset = 0;
offset = 9;

export const getUpdates = async () => {
  const res = await fetch(`${API}/getUpdates?timeout=30&offset=${offset}`);
  const data = await res.json();
  return data.result.map((upd) => {
    const { update_id: updateId, message } = upd;
    const { message_id: messageId, from, chat, date, text } = message;
    const { id: userId, is_bot: isBot } = from;
    const {
      id: chatId,
      first_name: firstName,
      last_name: lastName,
      username,
    } = chat;

    return {
      updateId,
      messageId,
      userId,
      isBot,
      date,
      text,
      chatId,
      firstName,
      lastName,
      username,
    };
  });
};

export const sendMessage = async (chatId, text) => {
  await fetch(`${API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
};

export const deleteMessage = async (chatId, messageId) => {
  const res = await fetch(`${API}/deleteMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId }),
  });
  return res.json();
};
