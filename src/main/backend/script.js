import { config } from "dotenv";
config();

import { Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.API_KEY,
  })
);

async function getChatGPTAnswer(input) {
  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: input }],
  });
  return res.data.choices[0].message.content;
}

module.exports = { getChatGPTAnswer };
