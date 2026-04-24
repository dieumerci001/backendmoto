import express from "express";
import OpenAI from "openai";
import { chatWithAI } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";
import { analyzeBehavior } from "../controllers/aiController.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const router = express.Router();

router.post("/chat", (req, res) => {
  res.json({ message: "ok" });
});

// Public chat for homepage visitors — no auth required
router.post("/public-chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "Please send a message." });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are the official AI assistant for MMS Rwanda (Moto Management System).

About MMS Rwanda:
- A digital platform that modernizes motorcycle taxi (Moto) management in Rwanda
- Connects Motari (drivers), passengers, group leaders, and admins
- Covers all 30 districts of Rwanda
- Supports English, French, and Kinyarwanda
- Features: Ride Management, Group & Leader System, Secure Payments & Wallet, Analytics & Reports, AI Assistant, Real-time Tracking
- Registration is free. Users choose roles: PASSENGER, MOTARI, LEADER, or ADMIN
- After registration, users receive an email verification code
- Payments are encrypted and secure using a built-in wallet system
- Motari can track earnings, manage maintenance, and get AI-powered business advice
- Group Leaders manage teams of Motari, organize meetings, track attendance
- Admins have full system control

Rules:
- Answer ONLY questions related to MMS Rwanda and its features
- Be friendly, concise, and helpful
- If asked something unrelated, politely redirect to MMS Rwanda topics
- Respond in the same language the user writes in (English, French, or Kinyarwanda)
- Keep answers short and clear (max 3-4 sentences)`
        },
        { role: "user", content: message }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (e) {
    console.error("Public chat error:", e.message);
    res.status(500).json({ reply: "Sorry, I'm having trouble right now. Please try again shortly." });
  }
});

router.get("/behavior/:motariId", analyzeBehavior);

export default router;