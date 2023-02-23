import { Client, GatewayIntentBits, Events } from 'discord.js';
import { registerCommands } from './commands';
import { chatGPTReply } from '../chatgpt/chatgpt';
import { handleMessage } from './handler';
import config from '../utils/config';

if (config.app.ENABLE_DISCORD.toUpperCase() === 'TRUE') {
  const start = async () => {
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
      ],
    });

    client.once(Events.ClientReady, () => {
      if (!client.user || !client.application) {
        return;
      }
      console.log(`Discord bot 【${client.user.tag}】 logs in`);
    });

    client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      await interaction.deferReply();
      handleMessage(interaction);
    });

    client.on(Events.MessageCreate, async (message) => {
      if (!config.discord.ENABLE_DIRECT_MESSAGE || message.author.bot) {
        return;
      }
      const user = message.author;
      console.log(message);
      console.log('----Direct Message---');
      console.log('Date    : ' + new Date());
      console.log('UserId  : ' + user.id);
      console.log('User    : ' + user.username);
      console.log('Message : ' + message.content);
      console.log('--------------');

      if (message.mentions.has(client.user.id)) {
        const response = await chatGPTReply(message.content, user.id);
        await message.reply(response);
      }
    });
    client.login(config.discord.DISCORD_BOT_TOKEN);
    await registerCommands();
  };

  start().catch((err) => {
    console.error(err);
  });
}
