import { jsonDB } from '../utils/tools';
import { chatGPTReply } from '../chatgpt/chatgpt';

export const handleMessage = async (ctx) => {
  // When the bot receives a text message
  // bot.on(message('text'), async (ctx) => {
  // Get the text of the message and the user's ID
  console.log(ctx.message);
  const prompt = ctx.message?.text.trim();
  const chatId = ctx.message?.chat.id;

  switch (prompt) {
    // case UNLOCK_THOUGHT_CONTROL:
    //   // Reply with the UNLOCK_THOUGHT_CONTROL_MESSAGE and remove the keyboard
    //   await ctx.reply(UNLOCK_THOUGHT_CONTROL_MESSAGE, removeKeyboard);
    //   break;

    default:
      // If the message is not any command, send it to chatGPT

      // Send a typing indicator to the user
      await ctx.sendChatAction('typing');
      try {
        const message = await ctx.sendMessage('...');
        const response = await chatGPTReply(
          prompt,
          chatId.toString(),
          async (tempReply: string) => {
            const key = `${message.chat.id}-${message.message_id}`;

            if (jsonDB.get(key)) {
              console.log(key);
              console.log('true');
              console.log(tempReply);
              return;
            } else {
              console.log(key);
              console.log('false');
              console.log(tempReply);
            }

            jsonDB.set(key, true);

            await ctx.telegram
              .editMessageText(
                message.chat.id,
                message.message_id,
                undefined,
                tempReply || 'typing',
              )
              .catch(console.error)
              .finally(() => jsonDB.delete(key));
          },
        );

        // // delete the message and send a new one to notice the user
        await Promise.all([
          ctx.telegram.deleteMessage(message.chat.id, message.message_id),
          ctx.reply(response),
        ]);
      } catch (e) {
        await ctx.sendMessage('❌Something went wrong. Details: ' + e.message);
      }
  }
  // });
};
