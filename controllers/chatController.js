const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.chatWithBot = async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }],
    });

    const botReply = response.choices[0].message.content;
    res.json({ reply: botReply });

  } catch (err) {
    console.error("OpenAI Error:", err);
    res.status(500).json({ reply: 'Chatbot Error' });
  }
};
