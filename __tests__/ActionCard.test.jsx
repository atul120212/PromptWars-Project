import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionCard from '../components/outputs/ActionCard';

describe('ActionCard UI Component', () => {
    const mockAction = {
        id: 'test_123',
        title: 'Call 911',
        description: 'Dispatch ambulance to highway 5.',
        urgency: 'CRITICAL',
        priority: 1,
        category: 'CALL',
        target: 'Emergency Services',
        automated: false,
        verified: true,
        safetyNote: 'Ensure human confirmation before dispatch.'
    };

    it('renders the action card with CRITICAL urgency correctly', () => {
        render(<ActionCard action={mockAction} index={0} />);

        // Check titles and descriptions
        expect(screen.getByText('Call 911')).toBeInTheDocument();
        expect(screen.getByText('Dispatch ambulance to highway 5.')).toBeInTheDocument();

        // Check badges
        expect(screen.getByText(/CRITICAL/i)).toBeInTheDocument();
        expect(screen.getByText('P1')).toBeInTheDocument();
    });

    it('renders safety notes and verification tags', () => {
        render(<ActionCard action={mockAction} index={0} />);

        expect(screen.getByText('Ensure human confirmation before dispatch.')).toBeInTheDocument();
        expect(screen.getByText('✅ Verified')).toBeInTheDocument();
        expect(screen.getByText('👤 Manual')).toBeInTheDocument();
    });

    it('fires the feedback callback when feedback buttons are clicked', () => {
        const handleFeedback = jest.fn();
        render(<ActionCard action={mockAction} index={0} onFeedback={handleFeedback} />);

        const thumbsUpButton = screen.getByRole('button', { name: '👍' });
        fireEvent.click(thumbsUpButton);

        expect(handleFeedback).toHaveBeenCalledTimes(1);
        expect(handleFeedback).toHaveBeenCalledWith('test_123', 'helpful');
    });
});
