const RADAR_TG_URL = process.env.RADAR_TG_URL;
const ALERT_WORDS = process.env.ALERT_WORDS;

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
  
  const response = await fetch(RADAR_TG_URL).then((r) => r.text());
  const messages = response
    .split('<div class="tgme_widget_message_text js-message_text" dir="auto">')
    .slice(1)
    .map((text) => text.split("</div>").at(0).toLowerCase());
  const alertMessages = messages
    .filter((message) => Boolean(alertWords.find((alertWord) => message.includes(alertWord))))
    .map((alertMessage) => alertMessage.split('<i class="emoji"').at(0));

  if (alertMessages.length >= 1) {
    console.error("ALERT MESSAGES:", JSON.stringify(alertMessages, null, 2));
  } else {
    console.log("VOID ALERT MESSAGES");
  }
};

await run();
