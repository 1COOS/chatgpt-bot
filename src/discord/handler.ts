import { AttachmentBuilder } from 'discord.js';
import { chatGPTReply } from '../chatgpt';
import stableDiffusion from '../utils/diffusion';

export const handleMessage = async (interaction) => {
  switch (interaction.commandName) {
    // case UNLOCK_THOUGHT_CONTROL:
    //   // Reply with the UNLOCK_THOUGHT_CONTROL_MESSAGE and remove the keyboard
    //   await ctx.reply(UNLOCK_THOUGHT_CONTROL_MESSAGE, removeKeyboard);
    //   break;

    case 'image':
      handleImage(interaction);
      break;

    default:
      handleText(interaction);
  }
  // });
};

const handleText = async (interaction) => {
  const prompt = interaction.options.getString('question');
  const response = await chatGPTReply(prompt, interaction.user.id);
  await interaction.editReply(response);
};

const handleImage = async (interaction) => {
  const prompt = interaction.options.getString('prompt');
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
        await interaction.editReply({ content: 'done...', files: attachments });
      } catch (e) {
        await interaction.editReply({ content: 'error...' });
      }
    });
  } catch (e) {
    console.error(e);
  }
};
