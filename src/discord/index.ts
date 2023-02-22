import config from '../utils/config';
import { registerCommands } from './commands';
import { chatGPTReply } from '../chatgpt';
import { Client, GatewayIntentBits, Events } from 'discord.js';
import { handleMessage } from './handler';

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

    // const prompt = interaction.options.getString('question');

    // const response = await chatGPTReply(prompt, interaction.user.id);
    // await interaction.editReply(response);

    handleMessage(interaction);
  });

  client.on(Events.MessageCreate, async (message) => {
    // if (
    //   process.env.ENABLE_DIRECT_MESSAGES !== 'true' ||
    //   message.channel.type != ChannelType.DM ||
    //   message.author.bot
    // ) {
    //   return;
    // }
    const user = message.author;
    console.log(message);
    console.log('----Direct Message---');
    console.log('Date    : ' + new Date());
    console.log('UserId  : ' + user.id);
    console.log('User    : ' + user.username);
    console.log('Message : ' + message.content);
    console.log('--------------');

    if (message.mentions.has(client.user.id)) {
      // handleMessage(message.content, user.id);

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
