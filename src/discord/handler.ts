import { AttachmentBuilder, EmbedBuilder } from 'discord.js';
import { chatGPTReply } from '../chatgpt/chatgpt';
import config from '../utils/config';
import stableDiffusion from '../utils/diffusion';

export const handleMessage = async (interaction) => {
  switch (interaction.commandName) {
    // case UNLOCK_THOUGHT_CONTROL:
    //   // Reply with the UNLOCK_THOUGHT_CONTROL_MESSAGE and remove the keyboard
    //   await ctx.reply(UNLOCK_THOUGHT_CONTROL_MESSAGE, removeKeyboard);
    //   break;
    case 'text':
    case 'chat':
      handleText(interaction);
      break;

    case 'image':
      handleImage(interaction);
      break;

    default:
      await interaction.reply({ content: 'Command Not Found' });
  }
  // });
};

const handleText = async (interaction) => {
  const prompt = interaction.options.getString('question');
  const response = await chatGPTReply(prompt, interaction.user.id);

  if (config.discord.ENABLE_EMBED_MESSAGE) {
    const embed = createEmbed(interaction.user, prompt, response);

    await interaction.editReply({ embeds: [embed] });
    // const stableDiffusionPrompt = response.slice(
    //   0,
    //   Math.min(response.length, 200),
    // );
    // stableDiffusion.generate(stableDiffusionPrompt, async (result) => {
    //   const results = result.results;
    //   if (!results || results.length == 0) {
    //     return;
    //   }
    //   const data = result.results[0].split(',')[1];
    //   const buffer = Buffer.from(data, 'base64');
    //   const attachment = new AttachmentBuilder(buffer, {
    //     name: 'result0.jpg',
    //   });
    //   embed.setImage('attachment://result0.jpg');
    //   await interaction.editReply({ embeds: [embed], files: [attachment] });
    // });
  } else {
    if (response.length >= config.discord.MAX_RESPONSE_CHUNK_LENGTH) {
      const attachment = new AttachmentBuilder(Buffer.from(response, 'utf-8'), {
        name: 'response.txt',
      });
      await interaction.editReply({ files: [attachment] });
    } else {
      await interaction.editReply({ response });
    }
  }
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

// export async function splitAndSendResponse(resp, user) {
//   let tryCount = 3;
//   while (resp.length > 0 && tryCount > 0) {
//     try {
//       let end = Math.min(MAX_RESPONSE_CHUNK_LENGTH, resp.length);
//       await user.send(resp.slice(0, end));
//       resp = resp.slice(end, resp.length);
//     } catch (e) {
//       tryCount--;
//       console.error(
//         'splitAndSendResponse Error : ' + e + ' | Counter ' + tryCount,
//       );
//     }
//   }

//   if (tryCount <= 0) {
//     throw 'Failed to send dm.';
//   }
// }
