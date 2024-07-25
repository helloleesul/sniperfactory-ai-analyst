function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

async function* streamResponse(response: Response) {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) return;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    yield decoder.decode(value);
  }
}

export async function POST(request: Request) {
  const { prompt, token, temperature, top_p } = await request.json();

  const LLAMA_REPLY_URL = process.env.LLAMA_REPLY_URL as string;

  const generateBody = {
    user_message: prompt,
    temperature,
    top_p,
  };

  const response = await fetch(LLAMA_REPLY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(generateBody),
  });

  // console.log("🚀 ~ POST ~ response:", response.status);

  if (!response.body) {
    return Response.json({ error: "No response body" }, { status: 500 });
  }

  const iterator = streamResponse(response);
  const stream = iteratorToStream(iterator);

  return new Response(stream);
}
