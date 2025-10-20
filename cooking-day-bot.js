const TG_BOT_API_TOKEN = process.env.TG_BOT_API_TOKEN;

const run = async () => {
  console.log('I BEELIVE!', Boolean(TG_BOT_API_TOKEN));
};

await run();
