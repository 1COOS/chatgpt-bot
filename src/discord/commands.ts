import { REST, Routes } from 'discord.js';
import config from '../utils/config';
import Constants from '../utils/constants';

export const registerCommands = async () => {
  const rest = new REST({ version: '10' }).setToken(
    config.discord.DISCORD_BOT_TOKEN,
  );
  try {
    await rest.put(
      Routes.applicationCommands(config.discord.DISCORD_CLIENT_ID),
      {
        body: Commands,
      },
    );
    console.log('Application commands registered successfully.');
  } catch (error) {
    console.error(error);
  }
};

const Commands = [
  {
    name: Constants.Commands.CHAT,
    description: 'Ask Anything!',
    options: [
      {
        name: Constants.PROMPT_STRING,
        description: 'Your prompt',
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: Constants.Commands.IMAGE,
    description: 'Describe your image',
    options: [
      {
        name: Constants.PROMPT_STRING,
        description: 'Your prompt',
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: Constants.Commands.FILE,
    description: 'Describe your file',
    options: [
      {
        name: Constants.PROMPT_STRING,
        description: 'Your prompt',
        type: 3,
        required: true,
      },
    ],
  },
];
