import { TELEGRAM_BOT_TOKEN } from '../utils/config';

import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { handleMessage } from './handler';

const start = async () => {
  const bot = new Telegraf(TELEGRAM_BOT_TOKEN, {
    handlerTimeout: 900_000,
  });

  bot.start(async (ctx) =>
    ctx.reply(`Hello ${ctx.from?.first_name}! Let's chat`),
  );

  bot.help((ctx) => ctx.reply("I'm chatgpt"));

  bot.on(message('text'), async (ctx) => {
    await handleMessage(ctx);
  });

  bot.launch();

  console.log(`Telegram bot starts`);
};

start().catch((err) => {
  console.error(err);
});
