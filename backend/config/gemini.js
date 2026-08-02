const { GoogleGenAI } = require('@google/genai');

let ai;
try {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} catch (error) {
  console.error('Failed to initialize GoogleGenAI. Is GEMINI_API_KEY set?');
}

module.exports = ai;
