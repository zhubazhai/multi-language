import axios from "axios";
import { Term, TranslationResponse } from "@/types";

// Mock Kimi API call since we don't have the actual API details

export const translateTerms = async (
  terms: Term
): Promise<TranslationResponse> => {
  const apiKey = "sk-7hcWlGZUeSZZjGOGa9lxQb5XEtlbvJIJS0Hdo5vQuBVX6w1D"; //  Kimi API Key
  const url = "https://api.moonshot.cn/v1/chat/completions";
  const params = {
    model: "moonshot-v1-8k",
    messages: [
      {
        role: "user",
        content: terms,
      },
      {
        role: "system",
        content:
          "你是金融/贸易领域资深翻译官，请把中文精准翻译成英文，仅返回译文，不做任何解释。",
      },
    ],
    temperature: 0.3,
  };

  const responseRes = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(params),
  });

  if (!responseRes.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await responseRes.json();

  return data.choices[0].message.content;
};
