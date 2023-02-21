import { ChatGPTAPI } from 'chatgpt';
import { jsonDB, retryRequest } from './utils/tools.js';
import { OPENAI_KEY } from './utils/config';

const chatGPT = new ChatGPTAPI({
  apiKey: OPENAI_KEY,
});

const getChatGPTReply = async (prompt: string, chatId: string, callback?) => {
  const chatInfo = jsonDB.get(chatId) ?? {};
  const chatOption = {
    conversationId: chatInfo.conversationId ?? undefined,
    parentMessageId: chatInfo.parentMessageId ?? undefined,
    promptPrefix: `Current date: ${new Date().toISOString()}\n\n`,
    onProgress: (progress) => {
      if (callback) {
        callback(progress.text);
      }
    },
  };
  const { conversationId, text, id } = await chatGPT.sendMessage(
    prompt,
    chatOption,
  );

  jsonDB.set(chatId, { conversationId, parentMessageId: id });
  return text;
};

export const chatGPTReply = async (
  prompt: string,
  chatId: string,
  callback?: (tempReply: string) => Promise<void>,
) => {
  try {
    const message = await retryRequest(
      () => getChatGPTReply(prompt, chatId, callback),
      3,
      500,
    );
    return message;
  } catch (e) {
    console.error(e);
    return null;
  }
};

/*
  type SendMessageOptions = {
    conversationId?: string;  
    parentMessageId?: string;
    messageId?: string;
    stream?: boolean;
    promptPrefix?: string;
    promptSuffix?: string;
    timeoutMs?: number;
    onProgress?: (partialResponse: ChatMessage) => void;
    abortSignal?: AbortSignal;
};
interface ChatMessage {
    id: string;
    text: string;
    role: Role;
    parentMessageId?: string;
    conversationId?: string;
    detail?: any;
}
*/
