import { ChatGPTAPI } from 'chatgpt';
import { jsonDB, retryRequest } from './utils/tools.js';
import { OPENAI_KEY } from './utils/config';
const chatGPT = new ChatGPTAPI({
    apiKey: OPENAI_KEY,
});
const getChatGPTReply = async (prompt, chatId, callback) => {
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
    const { conversationId, text, id } = await chatGPT.sendMessage(prompt, chatOption);
    jsonDB.set(chatId, { conversationId, parentMessageId: id });
    return text;
};
export const chatGPTReply = async (prompt, chatId, callback) => {
    try {
        const message = await retryRequest(() => getChatGPTReply(prompt, chatId, callback), 3, 500);
        return message;
    }
    catch (e) {
        console.error(e);
        return null;
    }
};
//# sourceMappingURL=chatgpt.js.map