import { jsonDB } from '../utils/tools';
import { chatGPTReply } from '../chatgpt/chatgpt';

export const handleMessage = async (ctx) => {
  console.log(ctx.message);
  const prompt = ctx.message?.text.trim();
  const chatId = ctx.message?.chat.id;

  switch (prompt) {
    default:
      // Send a typing indicator to the user
      await ctx.sendChatAction('typing');
      try {
        const message = await ctx.sendMessage('...');
        const response = await chatGPTReply(
          prompt,
          chatId.toString(),
          async (tempReply: string) => {
            const key = `${message.chat.id}-${message.message_id}`;
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

        await Promise.all([
          ctx.telegram.deleteMessage(message.chat.id, message.message_id),
          ctx.reply(response),
        ]);
      } catch (e) {
        await ctx.sendMessage(e.message);
      }
  }
};
