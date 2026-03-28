import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageUpload from '../components/inputs/ImageUpload';

describe('ImageUpload Component', () => {
    let originalAlert;

    beforeEach(() => {
        originalAlert = window.alert;
        window.alert = jest.fn();
    });

    afterEach(() => {
        window.alert = originalAlert;
    });

    it('renders initial dropzone', () => {
        render(<ImageUpload />);
        expect(screen.getByText('🖼️ Image / Document Upload')).toBeInTheDocument();
        expect(screen.getByText(/Drag & drop or/)).toBeInTheDocument();
    });

    it('handles file selection', async () => {
        const user = userEvent.setup();
        render(<ImageUpload />);

        const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
        const input = document.querySelector('input[type="file"]');

        Object.defineProperty(input, 'files', {
            value: [file]
        });
        fireEvent.change(input);

        await waitFor(() => {
            expect(screen.getByText('test.png')).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Optional: Add context/i)).toBeInTheDocument();
        });
    });

    it('rejects files larger than 10MB', async () => {
        render(<ImageUpload />);

        const largeFile = new File([''], 'large.png', { type: 'image/png' });
        Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 });

        const input = document.querySelector('input[type="file"]');
        Object.defineProperty(input, 'files', { value: [largeFile] });
        fireEvent.change(input);

        expect(window.alert).toHaveBeenCalledWith('File too large. Max 10MB.');
    });

    it('clears file when clear button is clicked', async () => {
        render(<ImageUpload />);

        const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
        const input = document.querySelector('input[type="file"]');

        Object.defineProperty(input, 'files', { value: [file] });
        fireEvent.change(input);

        await waitFor(() => {
            expect(screen.getAllByText('test.pdf')[0]).toBeInTheDocument();
        });

        const clearBtn = screen.getByRole('button', { name: /Clear/i });
        fireEvent.click(clearBtn);

        expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
        expect(screen.getByText(/Drag & drop or/)).toBeInTheDocument();
    });

    it('updates caption text', async () => {
        const user = userEvent.setup();
        render(<ImageUpload />);

        const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
        const input = document.querySelector('input[type="file"]');
        Object.defineProperty(input, 'files', { value: [file] });
        fireEvent.change(input);

        let textarea;
        await waitFor(() => {
            textarea = screen.getByPlaceholderText(/Optional: Add context/i);
            expect(textarea).toBeInTheDocument();
        });

        await user.type(textarea, 'X-ray image');
        expect(textarea).toHaveValue('X-ray image');
    });

    it('calls onImageAnalyze when analyze button is clicked', async () => {
        const handleAnalyze = jest.fn();
        render(<ImageUpload onImageAnalyze={handleAnalyze} />);

        const file = new File(['base64data'], 'test.png', { type: 'image/png' });
        const input = document.querySelector('input[type="file"]');
        Object.defineProperty(input, 'files', { value: [file] });
        fireEvent.change(input);

        await waitFor(() => {
            const analyzeBtn = screen.getByRole('button', { name: /Analyze with Gemini Vision/i });
            expect(analyzeBtn).not.toBeDisabled();
            fireEvent.click(analyzeBtn);
        });

        expect(handleAnalyze).toHaveBeenCalled();
        const callArgs = handleAnalyze.mock.calls[0][0];
        expect(callArgs.fileName).toBe('test.png');
        expect(callArgs.mimeType).toBe('image/png');
    });
});
