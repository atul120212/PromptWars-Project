import { GoogleGenerativeAI } from '@google/generative-ai';
import { DOMAIN_PROMPTS } from './prompts';

const getClient = () => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error('GEMINI_API_KEY_MISSING');
    }
    return new GoogleGenerativeAI(apiKey);
};

/**
 * Convert image file to base64 inline data part for Gemini
 */
function fileToGenerativePart(base64Data, mimeType) {
    return {
        inlineData: {
            data: base64Data,
            mimeType,
        },
    };
}

/**
 * Main analysis function — routes input to Gemini with the right domain prompt
 * @param {object} params
 * @param {'text'|'image'|'voice'|'stream'} params.type
 * @param {string} params.content - text content or transcript
 * @param {string} [params.imageBase64] - base64 image data
 * @param {string} [params.imageMimeType] - image mime type
 * @param {'MEDICAL'|'EMERGENCY'|'TRAVEL'|'CRISIS'|'ENVIRONMENT'|'GENERAL'} params.domain
 * @returns {Promise<object>} Structured action output
 */
export async function analyzeInput({ type, content, imageBase64, imageMimeType, domain = 'GENERAL' }) {
    const genAI = getClient();
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const systemPrompt = DOMAIN_PROMPTS[domain] || DOMAIN_PROMPTS.GENERAL;

    const userMessage = `Analyze this input and return the structured JSON response as instructed.

INPUT TYPE: ${type.toUpperCase()}
DOMAIN: ${domain}
TIMESTAMP: ${new Date().toISOString()}

INPUT CONTENT:
${content || '(see attached image)'}

Remember: Return ONLY valid JSON. No other text.`;

    let result;

    if (imageBase64 && type === 'image') {
        const imagePart = fileToGenerativePart(imageBase64, imageMimeType || 'image/jpeg');
        result = await model.generateContent([
            systemPrompt,
            userMessage,
            imagePart,
        ]);
    } else {
        result = await model.generateContent([systemPrompt, userMessage]);
    }

    const responseText = result.response.text();

    // Strip markdown code fences if Gemini wraps in ```json ... ```
    const cleaned = responseText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

    try {
        return { success: true, data: JSON.parse(cleaned) };
    } catch {
        return {
            success: false,
            error: 'Failed to parse Gemini response as JSON',
            raw: cleaned,
        };
    }
}

/**
 * Generate a streaming response for typing effect
 */
export async function analyzeInputStream({ type, content, domain = 'GENERAL' }, onChunk) {
    const genAI = getClient();
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const systemPrompt = DOMAIN_PROMPTS[domain] || DOMAIN_PROMPTS.GENERAL;

    const userMessage = `Analyze this input and return the structured JSON response as instructed.
INPUT TYPE: ${type.toUpperCase()}
DOMAIN: ${domain}
TIMESTAMP: ${new Date().toISOString()}
INPUT CONTENT:
${content}
Return ONLY valid JSON.`;

    const result = await model.generateContentStream([systemPrompt, userMessage]);
    let accumulated = '';

    for await (const chunk of result.stream) {
        const text = chunk.text();
        accumulated += text;
        if (onChunk) onChunk(text);
    }

    const cleaned = accumulated
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

    try {
        return { success: true, data: JSON.parse(cleaned) };
    } catch {
        return { success: false, error: 'Parse error', raw: cleaned };
    }
}
