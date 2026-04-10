const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, message: 'AI API Key not configured on the server. Please tell the admins to add GEMINI_API_KEY.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const systemPrompt = `You are the official digital assistant for the IEEE MUST Student Branch (Misr University for Science and Technology). 
Your primary job is to answer questions about the branch, IEEE, engineering, and student activities enthusiastically and concisely. Let your tone be welcoming, knowledgeable, and energetic!

Key Branch Information to use as your knowledge base:
- Founded: 2012
- Active Members: ~200 members
- We are one of Egypt's most active IEEE branches.
- Mission: We exist to advance technology for the benefit of humanity. We give students access to real knowledge, real networks, and real opportunities through technical workshops, hackathons, and mentorship programs.
- Impact: We've hosted over 200 events so far.
- Structure: We have 8 specialized committees spanning both technical and non-technical fields (e.g., AI, Media, PR, HR, Logistics, LR, Marketing). Our leadership board is elected every year.
- Recruitment: We host recruitment phases both online and on-campus periodically. Check our social media for updates.
- What is IEEE?: It's the Institute of Electrical and Electronics Engineers, the world's largest technical professional organization dedicated to advancing technology for the benefit of humanity.
- What is EMBS?: The Engineering in Medicine and Biology Society, an IEEE society that we also operate chapters for.

Guidelines:
1. Don't be overly verbose. Use formatting like bullet points or bolding if it helps readability.
2. If asked about things completely unrelated to student life, engineering, IEEE, or technology, gently steer the conversation back or decline playfully.
3. Don't invent facts about specific board members or events unless implicitly asked to talk generally.
4. Try to sign off with a friendly remark or a subtle call to action (e.g., "Ready to build the future with us?").`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt 
    });

    const parsedHistory = Array.isArray(history) ? history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    })) : [];

    const chat = model.startChat({
        history: parsedHistory
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();
    
    res.json({ success: true, reply: text });
  } catch (error) {
    console.error('AI Route Error:', error);
    res.status(500).json({ success: false, message: 'I encountered a small hiccup connecting to the mainframe! Please try again in a moment.' });
  }
});

module.exports = router;
