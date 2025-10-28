import { getUpdates, deleteMessage, sendMessage } from "../shared/tg-api";

const RADAR_TG_URL = process.env.RADAR_TG_URL;
const ALERT_WORDS = process.env.ALERT_WORDS;

const RED_MESSAGE = "❌ Предвижу ухудшение мобильного интернета!";
const GREEN_MESSAGE = "💚 Предвижу улучшение мобильного интернета!";

const getAlertMessage = async (alertWords) => {
  const response = await fetch(RADAR_TG_URL).then((r) => r.text());
  const messages = response
    .split('<div class="tgme_widget_message_text js-message_text" dir="auto">')
    .slice(1)
    .map((text) => text.split("</div>").at(0).toLowerCase());
  const alertMessages = messages
    .filter((message) =>
      Boolean(alertWords.find((alertWord) => message.includes(alertWord)))
    )
    .map((alertMessage) => alertMessage.split('<i class="emoji"').at(0));
  const lastAlertMessage = alertMessages.at(-1);

  if (lastAlertMessage.includes("Отбой")) {
    return GREEN_MESSAGE;
  }

  return alertMessages.length >= 1 ? RED_MESSAGE : null;
};

const run = async () => {
  if (!RADAR_TG_URL) {
    throw new Error("void RADAR_TG_URL");
  }

  const alertWords = ALERT_WORDS.split(",")
    .map((word) => word.trim().toLowerCase())
    .filter(Boolean);

  if (alertWords.length < 1) {
    throw new Error("error ALERT_WORDS");
  }

  const [alertMessage, updates] = await Promise.all([
    getAlertMessage(alertWords),
    getUpdates(),
  ]);
  const chatsToSend = new Map();

  for (const update of updates) {
    const { chatId, messageId, text } = update;

    if (text === RED_MESSAGE && alertMessage === GREEN_MESSAGE) {
      chatsToSend.set(chatId, GREEN_MESSAGE);
    } else if (alertMessage === RED_MESSAGE) {
      chatsToSend.set(chatId, RED_MESSAGE);
    }

    await deleteMessage(chatId, messageId);
  }

  for (const [chatId, text] of chatsToSend) {
    await sendMessage(chatId, text);
  }
};

await run();
