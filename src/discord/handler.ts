import { AttachmentBuilder, EmbedBuilder } from 'discord.js';
import { chatGPTReply } from '../chatgpt/chatgpt';
import config from '../utils/config';
import Constants from '../utils/constants';
import stableDiffusion from '../utils/diffusion';

export const handleMessage = async (interaction) => {
  switch (interaction.commandName) {
    case Constants.Commands.TEXT:
    case Constants.Commands.CHAT:
      handleText(interaction);
      break;
    case Constants.Commands.IMAGE:
      handleImage(interaction);
      break;
    case Constants.Commands.FILE:
      handleFile(interaction);
      break;
    default:
      await interaction.reply({ content: 'Command Not Found' });
  }
};

const handleText = async (interaction) => {
  const prompt = interaction.options.getString(Constants.PROMPT_STRING);
  const response = await chatGPTReply(prompt, interaction.user.id);

  if (config.discord.ENABLE_EMBED_MESSAGE) {
    const embed = createEmbed(interaction.user, prompt, response);

    await interaction.editReply({ embeds: [embed] });
  } else {
    if (response.length >= config.discord.MAX_RESPONSE_CHUNK_LENGTH) {
      const attachment = new AttachmentBuilder(Buffer.from(response, 'utf-8'), {
        name: 'Response.txt',
      });
      await interaction.editReply({ files: [attachment] });
    } else {
      await interaction.editReply({ response });
    }
  }
};

const handleFile = async (interaction) => {
  console.log(interaction);
  const prompt = interaction.options.getString(Constants.PROMPT_STRING);
  const response = await chatGPTReply(prompt, interaction.user.id);
  const attachment = new AttachmentBuilder(Buffer.from(response, 'utf-8'), {
    name: `GPT_${interaction.id}.txt`,
  });
  await interaction.editReply({ files: [attachment] });
};

const handleImage = async (interaction) => {
  const prompt = interaction.options.getString(Constants.PROMPT_STRING);
  try {
    stableDiffusion.generate(prompt, async (result) => {
      if (result.error) {
        await interaction.editReply({ content: 'error...' });
        return;
      }
      try {
        const attachments = [];
        for (let i = 0; i < result.results.length; i++) {
          const data = result.results[i].split(',')[1];
          const buffer = Buffer.from(data, 'base64');
          const attachment = new AttachmentBuilder(buffer, {
            name: 'result0.jpg',
          });
          attachments.push(attachment);
        }
        await interaction.editReply({ content: prompt, files: attachments });
      } catch (e) {
        await interaction.editReply({ content: 'error...' });
      }
    });
  } catch (e) {
    console.error(e);
  }
};

const createEmbed = (user, prompt, response) => {
  if (prompt.length >= 250) {
    prompt = prompt.slice(0, 250) + '...';
  }

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setAuthor({ name: user.username })
    .setTitle(prompt)
    .setDescription(response.slice(0, Math.min(response.length, 4096)));

  if (response.length > 4096) {
    response = response.slice(4096, response.length);
    for (let i = 0; i < 10 && response.length > 0; i++) {
      embed.addFields({
        name: '',
        value: response.slice(0, Math.min(response.length, 1024)),
      });
      response = response.slice(
        Math.min(response.length, 1024),
        response.length,
      );
    }
  }
  return embed;
};
