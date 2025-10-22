const TG_BOT_API_TOKEN = process.env.TG_BOT_API_TOKEN;
const API = `https://api.telegram.org/bot${TG_BOT_API_TOKEN}`;

let offset = 0;

const getUpdates = async () => {
  const res = await fetch(`${API}/getUpdates?timeout=30&offset=${offset}`);
  const data = await res.json();
  return data.result;
};

const sendMessage = async (chat_id, text) => {
  await fetch(`${API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id, text }),
  });
};

const run = async () => {
  const updates = await getUpdates();

  console.log("UPDATES:", JSON.stringify(updates, null, 2));
};

await run();
