import { BASE_URL } from "@/constants";

interface AiReplyParams {
  prompt: string;
  temperature?: number;
  top_p?: number;
  onAiMessageHandler?: (value: string) => void;
  onFinally?: (value: string) => void;
}

async function fetchAiReply({ prompt, temperature = 0.5, top_p = 0.5, onAiMessageHandler, onFinally }: AiReplyParams) {
  let aiMessage = "";

  try {
    const token = await (await fetch(`${BASE_URL}/api/ai/token`, { cache: "no-store" })).json();
    const aiResponse = await fetch(`${BASE_URL}/api/ai/reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, token, temperature, top_p }),
    });

    if (!aiResponse.ok) {
      throw new Error("Network response was not ok.");
    }

    if (!aiResponse.body) {
      throw new Error("No response body.");
    }

    const reader = aiResponse.body.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log("모든 데이터를 성공적으로 읽었습니다.");
        break;
      }

      const text = new TextDecoder().decode(value);
      aiMessage += text;

      if (onAiMessageHandler) onAiMessageHandler(aiMessage);
    }
  } catch (error) {
    console.error("스트림 처리 중 에러:", error);
  } finally {
    if (onFinally) onFinally(aiMessage);
    return aiMessage;
  }
}

export default fetchAiReply;
