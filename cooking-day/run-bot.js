const TG_BOT_API_TOKEN = process.env.TG_BOT_API_TOKEN;
const API = `https://api.telegram.org/bot${TG_BOT_API_TOKEN}`;

let offset = 0;

/**
 @typedef {Object} User
 @property {number} id - Уникальный идентификатор пользователя.
 @property {boolean} is_bot - Является ли пользователь ботом.
 @property {string} first_name - Имя пользователя.
 @property {string} [last_name] - Фамилия пользователя.
 @property {string} [username] - Имя пользователя в Telegram.
 @property {string} [language_code] - Код языка клиента пользователя.
 */

/**
 @typedef {Object} Chat
 @property {number} id - Уникальный идентификатор чата.
 @property {string} type - Тип чата (например, "private").
 @property {string} [first_name] - Имя участника чата.
 @property {string} [last_name] - Фамилия участника чата.
 @property {string} [username] - Имя пользователя в Telegram.
 */

/**
 @typedef {Object} Message
 @property {number} message_id - Уникальный идентификатор сообщения.
 @property {User} from - Отправитель сообщения.
 @property {Chat} chat - Чат, в котором отправлено сообщение.
 @property {number} date - Временная метка отправки сообщения (Unix time).
 @property {string} text - Текст сообщения.
 */

/**
 @typedef {Object} Update
 @property {number} update_id - Уникальный идентификатор обновления.
 @property {Message} message - Объект входящего сообщения.
 */

/**
 Результат выполнения асинхронной функции, имитирующей получение обновлений от Telegram Bot API.
 * @async
 @function getUpdates
 @returns {Promise<Update[]>} Массив объектов обновлений от Telegram.
 */

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
