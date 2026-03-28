import { analyzeInput, analyzeInputStream } from '../lib/gemini';

const mockGenerateContent = jest.fn();
const mockGenerateContentStream = jest.fn();

jest.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: jest.fn().mockImplementation(() => {
            return {
                getGenerativeModel: jest.fn().mockReturnValue({
                    generateContent: mockGenerateContent,
                    generateContentStream: mockGenerateContentStream
                })
            };
        })
    };
});

describe('gemini lib', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env = { ...originalEnv, GEMINI_API_KEY: 'mock-key' };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('throws error if API key is missing', async () => {
        delete process.env.GEMINI_API_KEY;
        await expect(analyzeInput({ type: 'text', content: 'test' }))
            .rejects.toThrow('GEMINI_API_KEY_MISSING');
    });

    it('parses valid json response correctly', async () => {
        mockGenerateContent.mockResolvedValueOnce({
            response: {
                text: () => '```json\n{"intent": "Test", "confidence": 99}\n```'
            }
        });

        const result = await analyzeInput({ type: 'text', content: 'test data' });
        expect(result.success).toBe(true);
        expect(result.data.intent).toBe('Test');
        expect(result.data.confidence).toBe(99);
    });

    it('handles invalid json gracefully', async () => {
        mockGenerateContent.mockResolvedValueOnce({
            response: {
                text: () => 'not a json'
            }
        });

        const result = await analyzeInput({ type: 'text', content: 'test data' });
        expect(result.success).toBe(false);
        expect(result.error).toContain('Failed to parse Gemini response as JSON');
        expect(result.raw).toBe('not a json');
    });

    it('handles image type correctly', async () => {
        mockGenerateContent.mockResolvedValueOnce({
            response: {
                text: () => '{"success": true}'
            }
        });

        await analyzeInput({
            type: 'image',
            content: 'caption',
            imageBase64: 'base64str',
            imageMimeType: 'image/png'
        });

        expect(mockGenerateContent).toHaveBeenCalled();
        const callArgs = mockGenerateContent.mock.calls[0][0];
        expect(callArgs).toHaveLength(3); // prompt, userMessage, imagePart
        expect(callArgs[2]).toHaveProperty('inlineData');
        expect(callArgs[2].inlineData.data).toBe('base64str');
    });

    it('handles analyzeInputStream correctly', async () => {
        mockGenerateContentStream.mockResolvedValueOnce({
            stream: [
                { text: () => '{"chunk1"' },
                { text: () => ': "val1"}' }
            ]
        });

        const onChunk = jest.fn();
        const result = await analyzeInputStream({ type: 'stream', content: 'test' }, onChunk);

        expect(onChunk).toHaveBeenCalledTimes(2);
        expect(onChunk).toHaveBeenNthCalledWith(1, '{"chunk1"');
        expect(onChunk).toHaveBeenNthCalledWith(2, ': "val1"}');
        expect(result.success).toBe(true);
        expect(result.data).toEqual({ chunk1: 'val1' });
    });

    it('returns false structure on parsing error in streaming', async () => {
        mockGenerateContentStream.mockResolvedValueOnce({
            stream: [
                { text: () => '{badjson' }
            ]
        });

        const result = await analyzeInputStream({ type: 'stream', content: 'test' });
        expect(result.success).toBe(false);
        expect(result.error).toBe('Parse error');
    });
});
