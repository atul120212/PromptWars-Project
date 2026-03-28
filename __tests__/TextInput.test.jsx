import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextInput from '../components/inputs/TextInput';

// Mock the DOMAIN_EXAMPLES to test the domain prop
jest.mock('../lib/prompts', () => ({
    DOMAIN_EXAMPLES: {
        GENERAL: 'General example',
        MEDICAL: 'Medical example',
    },
}));

describe('TextInput Component', () => {
    it('renders correctly', () => {
        render(<TextInput />);
        expect(screen.getByText('💬 Text / Data Input')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Analyze Input/i })).toBeInTheDocument();
    });

    it('updates text on typing', async () => {
        const user = userEvent.setup();
        render(<TextInput />);
        const textarea = screen.getByRole('textbox');
        await user.type(textarea, 'Hello World');
        expect(textarea).toHaveValue('Hello World');
        expect(screen.getByText('11 chars')).toBeInTheDocument();
    });

    it('calls onSubmit with text when submit button is clicked', async () => {
        const handleSubmit = jest.fn();
        const user = userEvent.setup();
        render(<TextInput onSubmit={handleSubmit} />);

        const textarea = screen.getByRole('textbox');
        await user.type(textarea, 'Test data input');

        const submitBtn = screen.getByRole('button', { name: /Analyze Input/i });
        await user.click(submitBtn);

        expect(handleSubmit).toHaveBeenCalledWith('Test data input');
    });

    it('does not call onSubmit if text is empty', async () => {
        const handleSubmit = jest.fn();
        const user = userEvent.setup();
        render(<TextInput onSubmit={handleSubmit} />);

        const submitBtn = screen.getByRole('button', { name: /Analyze Input/i });
        expect(submitBtn).toBeDisabled();
        // Cannot click disabled button
        fireEvent.click(submitBtn);
        expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('shows processing state', () => {
        render(<TextInput isProcessing={true} />);
        expect(screen.getByRole('button', { name: /Analyzing.../i })).toBeDisabled();
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('loads example when example button is clicked', async () => {
        const user = userEvent.setup();
        render(<TextInput />);
        const weatherBtn = screen.getByRole('button', { name: '🌦️ Weather Alert' });
        await user.click(weatherBtn);
        const textarea = screen.getByRole('textbox');
        expect(textarea.value).toContain('Weather Data');
    });

    it('loads domain example when domain example button is clicked', async () => {
        const user = userEvent.setup();
        render(<TextInput domain="MEDICAL" />);
        const domainBtn = screen.getByRole('button', { name: '✨ Domain Example' });
        await user.click(domainBtn);
        const textarea = screen.getByRole('textbox');
        expect(textarea.value).toContain('Medical example');
    });

    it('clears text when clear button is clicked', async () => {
        const user = userEvent.setup();
        render(<TextInput />);
        const textarea = screen.getByRole('textbox');
        await user.type(textarea, 'Some text to clear');

        const clearBtn = screen.getByRole('button', { name: /Clear/i });
        await user.click(clearBtn);

        expect(textarea).toHaveValue('');
        expect(screen.getByText('0 chars')).toBeInTheDocument();
    });
});
