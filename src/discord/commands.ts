import { DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID } from '../utils/config';
import { REST, Routes } from 'discord.js';

export const registerCommands = async () => {
  const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);
  try {
    await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), {
      body: Commands,
    });
    console.log('Application commands registered successfully.');
  } catch (error) {
    console.error(error);
  }
};

const Commands = [
  {
    name: 'chat',
    description: 'Ask Anything!',
    options: [
      {
        name: 'question',
        description: 'Your question',
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: 'image',
    description: 'Ask Anything!',
    options: [
      {
        name: 'prompt',
        description: 'Your prompt',
        type: 3,
        required: true,
      },
    ],
  },
];
