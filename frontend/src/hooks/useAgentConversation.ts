// src/hooks/useAgentConversation.ts
import { useConversation } from '@elevenlabs/react';

export const useAgentConversation = (agentId: string) => {
  const conversation = useConversation({
    clientTools: {
      alertUser: ({ message }: { message: string }) => {
        alert(message);
        return 'alert shown';
      },
    },
  });

  const start = async () => {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    await conversation.startSession({
      agentId,
      connectionType: 'webrtc', // or 'websocket'
    });
  };

  const stop = async () => {
    await conversation.endSession();
  };

  const sendMessage = (text: string) => {
    conversation.sendUserMessage(text);
  };

  return {
    conversation,
    start,
    stop,
    sendMessage,
  };
};
