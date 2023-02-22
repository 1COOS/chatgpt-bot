type ConversationInfo = {
  conversationId: string;
  parentMessageId: string;
  newConversation: boolean;
};

const conversationMap = {};

const get = (key: string): ConversationInfo => {
  let conversation: ConversationInfo;
  if (!conversationMap[key]) {
    conversation = {
      conversationId: undefined,
      parentMessageId: undefined,
      newConversation: true,
    };
  }
  return conversation;
};

const set = (key: string, conversation: ConversationInfo) => {
  conversationMap[key] = conversation;
};

function reset(key: string) {
  delete conversationMap[key];
}

export default {
  get,
  set,
  reset,
};
