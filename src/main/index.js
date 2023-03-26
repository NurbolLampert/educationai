const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { Configuration, OpenAIApi } = require("openai");

const  config = new Configuration({
    apiKey: "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",
})

const openai = new OpenAIApi(config);

//server
const app = express();
app.use(bodyParser.json());
app.use(cors());

//endpoint
app.post("/chat", async (req, res) => {
    const { prompt } = req.body;
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        max_tokens: 512,
        temperature: 0,
        prompt: prompt,
    });

    res.send(completion.data.choices[0].text);
})

const port = 8080;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})