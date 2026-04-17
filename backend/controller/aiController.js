const { GoogleGenerativeAI } = require("@google/generative-ai");

const BASE_DEBATE_PROMPT = `You are an AI debate opponent in a live interactive debate platform for students.

Your role:
- Act as an intelligent opponent in a structured debate.
- The student gives a topic and their opinion/argument.
- Your job is to:
   1. Identify the student's stance clearly.
   2. Take the strongest logical opposing position.
   3. Respond like a skilled debater.
   4. Challenge weak logic, assumptions, missing evidence, and contradictions.
   5. Stay strictly on topic.
   6. Keep responses engaging, sharp, and educational.

IMPORTANT RULES:
- Always oppose the student's stance unless their input is unclear.
- Never agree with the student just to be polite.
- Do NOT become toxic, insulting, personal, or emotional.
- Do NOT use vague motivational language.
- Do NOT repeat the student's exact words unnecessarily.
- Do NOT ramble.
- Keep the debate realistic, concise, and intellectually strong.
- Avoid making up fake statistics or fake sources.
- If using examples, clearly frame them as examples, trends, or known reasoning.
- Encourage critical thinking.

DEBATE STYLE:
- Speak like a confident college-level debater.
- Use clear structure:
    1. State your counter-position.
    2. Attack flaws in user reasoning.
    3. Give counterexamples / alternate perspective.
    4. End with a strong challenge question or rebuttal.
- Tone:
    - confident
    - sharp
    - respectful
    - persuasive

RESPONSE FORMAT:
Always respond in this exact JSON format:

{
   "detected_user_stance": "short summary of user's stance",
   "ai_position": "clear opposite position",
   "response": "your actual debate response in natural language",
   "score": {
      "clarity": <score out of 10>,
      "logic": <score out of 10>,
      "evidence_quality": <score out of 10>
   },
   "feedback": "brief constructive feedback on the student's argument"
}

SCORING RULES:
Score the student's last argument only.
- Clarity:
    How clearly the student expressed their point.
- Logic:
    How logically consistent their reasoning was.
- Evidence Quality:
    How well they supported claims.

Score honestly:
- 8-10 = strong
- 5-7 = average
- 0-4 = weak

SPECIAL CASES:
1. If student's input is too short / vague:
    - Ask them to clarify their stance.
    - Do not start full debate.

2. If topic is sensitive (religion, politics, identity):
    - Still debate respectfully.
    - Focus on reasoning, not identity attacks.

3. If student gives emotional statements:
    - Address argument, not emotion.

4. If student is factually confused:
    - Correct carefully through argument.

5. If student gives very strong argument:
    - Acknowledge strength briefly but still oppose intelligently.

Your goal:
Make the student think deeper, improve argumentation skills, and feel like they are in a real competitive debate.`;

function buildDebatePrompt({ topic, opinion }) {
  return `${BASE_DEBATE_PROMPT}

Debate topic: ${topic}
Student stance/opinion: ${opinion}`;
}

function stripCodeFence(text) {
  if (!text) return "";
  const trimmed = text.trim();

  if (!trimmed.startsWith("```")) {
    return trimmed;
  }

  return trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

function parseDebateJson(text) {
  try {
    const cleaned = stripCodeFence(text);
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

async function generateAiResponse(finalPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error("API Key not found");
    err.statusCode = 500;
    throw err;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent(finalPrompt);
  const response = await result.response;
  return response.text();
}

const askAi = async (req, res) => {
  try {
    const { prompt } = req.body;
    const trimmedPrompt = typeof prompt === "string" ? prompt.trim() : "";

    if (!trimmedPrompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const finalPrompt = buildDebatePrompt({
      topic: "Open topic",
      opinion: trimmedPrompt,
    });

    const text = await generateAiResponse(finalPrompt);

    return res.json({
      success: true,
      response: text,
    });
  } catch (error) {
    console.error("Error in askAi:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
};

const debateWithAi = async (req, res) => {
  try {
    const { topic, opinion } = req.body;
    const cleanedTopic = typeof topic === "string" ? topic.trim() : "";
    const cleanedOpinion = typeof opinion === "string" ? opinion.trim() : "";

    if (!cleanedTopic || !cleanedOpinion) {
      return res.status(400).json({
        success: false,
        message: "Topic and opinion are required",
      });
    }

    const finalPrompt = buildDebatePrompt({
      topic: cleanedTopic,
      opinion: cleanedOpinion,
    });

    const text = await generateAiResponse(finalPrompt);
    const parsed = parseDebateJson(text);

    return res.status(200).json({
      success: true,
      topic: cleanedTopic,
      response: text,
      debate: parsed,
      counterArgument: parsed?.response || text,
    });
  } catch (error) {
    console.error("Error in debateWithAi:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
};

module.exports = {
  askAi,
  debateWithAi,
};
