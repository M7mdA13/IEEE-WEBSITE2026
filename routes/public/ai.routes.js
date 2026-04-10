const express = require('express');
const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { history, message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt = `You are the official digital assistant for the IEEE MUST (Misr University for Science and Technology) Student Branch. 
You are enthusiastic, professional, and concise. Your goal is to help visitors understand who we are and what we do.
We were founded in 2012, and currently have over 200 members.
Context Rules:
- Impact: We've hosted over 200 events so far.
- Structure: We have 8 specialized committees spanning both technical and non-technical fields (e.g., AI, Media, PR, HR, Logistics, LR, Marketing). Our leadership board is elected every year.
- Recruitment: We host recruitment phases both online and on-campus periodically. Check our social media for updates.
- What is IEEE?: It's the Institute of Electrical and Electronics Engineers, the world's largest technical professional non-profit organization dedicated to advancing technology for the benefit of humanity.
- IEEE SAC: The Student Activities Committee, a global IEEE group that oversees, empowers, and supports student branches like ours around the world.
- IEEE YP: Young Professionals, an international IEEE group for early-career professionals (up to 15 years post-graduation) offering premium networking, mentoring, and career development opportunities.

Guidelines:
1. Don't be overly verbose. Use formatting like bullet points or bolding if it helps readability.
2. If asked something unrelated to IEEE, tech, or our branch, gently steer the conversation back.
3. Don't invent fake events, member names, or deadlines. Say you don't have the current info and point them to our social media.
4. Try to sign off with a friendly remark or a subtle call to action (e.g., "Ready to build the future with us?").`;

    // Map history to native Groq/OpenAI JSON format
    let messages = [
      { role: 'system', content: systemPrompt }
    ];

    if (Array.isArray(history)) {
      history.forEach(msg => {
        messages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.text
        });
      });
    }

    // Append the latest user message
    messages.push({
      role: 'user',
      content: message
    });

    // Groq natively accepts standard HTTP requests with the exact same OpenAI schema
    // We use native node fetch to bypass any npm install freezing issues
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: messages,
        temperature: 0.6,
        max_tokens: 512
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API Failure:", data);
      throw new Error(data.error?.message || "Failed to fetch from Groq API");
    }

    const reply = data.choices[0]?.message?.content || "I'm having trouble connecting right now.";

    res.json({ success: true, reply });
  } catch (error) {
    console.error('AI Route Error:', error);
    res.status(500).json({ error: 'Failed to process AI request' });
  }
});

module.exports = router;
