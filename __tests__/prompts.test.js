import { DOMAIN_PROMPTS, DOMAIN_EXAMPLES } from '../lib/prompts';

describe('Domain Prompts & Examples', () => {
    it('should have exactly 6 defined domains with identical keys in PROMPTS and EXAMPLES', () => {
        const promptKeys = Object.keys(DOMAIN_PROMPTS).sort();
        const exampleKeys = Object.keys(DOMAIN_EXAMPLES).sort();

        expect(promptKeys).toEqual(exampleKeys);
        expect(promptKeys.length).toBe(6);
    });

    it('should include strictly REQUIRED fields in the system base prompt', () => {
        const basePrompt = DOMAIN_PROMPTS.GENERAL;
        expect(basePrompt).toContain('"intent"');
        expect(basePrompt).toContain('"domain"');
        expect(basePrompt).toContain('"urgency"');
        expect(basePrompt).toContain('"confidence"');
        expect(basePrompt).toContain('"actions"');
        expect(basePrompt).toContain('"verification"');
    });

    it('should apply medical-specific context to the MEDICAL prompt', () => {
        expect(DOMAIN_PROMPTS.MEDICAL).toContain('Triage classification');
        expect(DOMAIN_PROMPTS.MEDICAL).toContain('Drug interaction');
    });
});
