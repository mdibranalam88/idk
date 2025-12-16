import React, { useEffect, useState } from "react";
import { useConversation } from "@elevenlabs/react";

type Agent = {
  id: string;
  name: string;
};

const agentsList: Agent[] = [
  { id: "agent_4501kae38yqaeh0sn0gq9bxsy3gr", name: "Agent 1" },
];

const MultiAgent: React.FC = () => {
  const { startSession, endSession, isSpeaking } = useConversation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);

  const startAgent = async (agentId: string) => {
    console.log("Starting agent:", agentId);

    // Directly start session with agentId (no backend)
    await startSession({
      agentId,
      connectionType: "webrtc",
      userId: "user_demo_123",
    });

    setSessionActive(true);
  };

  // Start first agent on load
  useEffect(() => {
    startAgent(agentsList[0].id);
  }, []);

  // Move to next agent after speaking stops
  useEffect(() => {
    if (sessionActive && !isSpeaking) {
      const timeout = setTimeout(async () => {
        await moveToNextAgent();
      }, 800); // wait 800ms to prevent WebRTC crash

      return () => clearTimeout(timeout);
    }
  }, [isSpeaking]);

  const moveToNextAgent = async () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= agentsList.length) {
      console.log("All agents finished.");
      await endSession();
      return;
    }

    console.log("Ending previous agent...");
    await endSession();

    // Delay to prevent WebRTC crash
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      startAgent(agentsList[nextIndex].id);
    }, 600);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Sequential Multi-Agent Conversation (Frontend Only)</h2>
      <p>
        Current Agent: <b>{agentsList[currentIndex].name}</b>
      </p>
      <p>Speaking: {isSpeaking ? "Yes" : "No"}</p>
    </div>
  );
};

export default MultiAgent;
