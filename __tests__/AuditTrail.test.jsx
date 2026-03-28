import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuditTrail from '../components/outputs/AuditTrail';

describe('AuditTrail Component', () => {
    const mockSessions = [
        {
            id: 'session-1',
            domain: 'MEDICAL',
            intent: 'Medical Issue',
            urgency: 'HIGH',
            timestamp: new Date('2024-01-01T10:00:00.000Z').getTime(),
            inputType: 'Text',
            confidence: 88,
            actionCount: 2,
            inputPreview: 'I have a headache'
        },
        {
            id: 'session-2',
            domain: 'EMERGENCY',
            intent: 'Fire reported',
            urgency: 'CRITICAL',
            timestamp: new Date('2024-01-01T11:00:00.000Z').getTime(),
            inputType: 'Voice',
            confidence: 95,
            actionCount: 3,
            inputPreview: 'Fire on 5th avenue'
        }
    ];

    it('renders empty state when no sessions', () => {
        render(<AuditTrail sessions={[]} />);
        expect(screen.getByText(/No sessions yet/i)).toBeInTheDocument();
    });

    it('renders sessions list', () => {
        render(<AuditTrail sessions={mockSessions} />);

        expect(screen.getByText('📋 Audit Trail')).toBeInTheDocument();
        expect(screen.getByText('2 sessions')).toBeInTheDocument();

        expect(screen.getAllByText(/MEDICAL/i)[0]).toBeInTheDocument();
        expect(screen.getByText('Medical Issue')).toBeInTheDocument();
        expect(screen.getByText('HIGH')).toBeInTheDocument();

        expect(screen.getAllByText(/EMERGENCY/i)[0]).toBeInTheDocument();
        expect(screen.getByText('Fire reported')).toBeInTheDocument();
        expect(screen.getByText('CRITICAL')).toBeInTheDocument();
    });

    it('expands session details on click', () => {
        render(<AuditTrail sessions={mockSessions} />);

        const medicalBtn = screen.getByRole('button', { name: /Medical Issue/i });
        fireEvent.click(medicalBtn);

        // details shown
        expect(screen.getByText('Input Type:')).toBeInTheDocument();
        expect(screen.getByText('Text')).toBeInTheDocument();
        expect(screen.getByText('actions generated', { exact: false })).toBeInTheDocument();
        expect(screen.getByText('I have a headache')).toBeInTheDocument();

        // click again to collapse
        fireEvent.click(medicalBtn);
        expect(screen.queryByText('Input Type:')).not.toBeInTheDocument();
    });

    it('calls onReplay when replay button is clicked', () => {
        const handleReplay = jest.fn();
        render(<AuditTrail sessions={mockSessions} onReplay={handleReplay} />);

        // expand first
        const medicalBtn = screen.getByRole('button', { name: /Medical Issue/i });
        fireEvent.click(medicalBtn);

        const replayBtn = screen.getByRole('button', { name: /Replay Session/i });
        fireEvent.click(replayBtn);

        expect(handleReplay).toHaveBeenCalledWith(mockSessions[0]);
    });
});
