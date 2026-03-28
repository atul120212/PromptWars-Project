import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionDashboard from '../components/outputs/ActionDashboard';

// Mock ActionCard since it has its own tests
jest.mock('../components/outputs/ActionCard', () => {
    return function MockActionCard({ action }) {
        return <div data-testid="mock-action-card">{action.title}</div>;
    };
});

describe('ActionDashboard Component', () => {
    const mockResult = {
        success: true,
        data: {
            intent: 'Medical Emergency',
            urgency: 'CRITICAL',
            domain: 'MEDICAL',
            confidence: 95,
            actions: [
                { id: 1, title: 'Dispatch Ambulance', urgency: 'CRITICAL' },
                { id: 2, title: 'Check Vitals', urgency: 'HIGH' }
            ],
            safetyChecks: [{ check: 'Protocol A', passed: true }],
            structuredData: { keyFacts: ['Patient has chest pain'] },
            entities: { symptoms: ['chest pain'] },
        }
    };

    it('renders loading state', () => {
        render(<ActionDashboard isLoading={true} />);
        expect(screen.getByText('Gemini is Processing...')).toBeInTheDocument();
    });

    it('renders empty state when no result', () => {
        render(<ActionDashboard isLoading={false} result={null} />);
        expect(screen.getByText('Ready for Input')).toBeInTheDocument();
    });

    it('renders error state when result is not successful', () => {
        render(<ActionDashboard result={{ success: false, error: 'API Error' }} />);
        expect(screen.getByText('Analysis Failed')).toBeInTheDocument();
        expect(screen.getByText('API Error')).toBeInTheDocument();
    });

    it('renders successful result', () => {
        render(<ActionDashboard result={mockResult} />);

        expect(screen.getByText('Medical Emergency')).toBeInTheDocument();
        expect(screen.getByText('CRITICAL')).toBeInTheDocument();
        expect(screen.getByText('MEDICAL')).toBeInTheDocument();
        expect(screen.getByText('95%')).toBeInTheDocument();
        expect(screen.getByText(/Patient has chest pain/)).toBeInTheDocument();
        expect(screen.getByText('symptoms:')).toBeInTheDocument();

        // Check mocked ActionCards
        expect(screen.getByText('Dispatch Ambulance')).toBeInTheDocument();
        expect(screen.getByText('Check Vitals')).toBeInTheDocument();
    });

    it('filters actions by urgency', () => {
        render(<ActionDashboard result={mockResult} />);

        // Filter by CRITICAL
        fireEvent.click(screen.getByRole('button', { name: /CRITICAL/i }));

        expect(screen.getByText('Dispatch Ambulance')).toBeInTheDocument();
        expect(screen.queryByText('Check Vitals')).not.toBeInTheDocument();

        // Filter ALL
        fireEvent.click(screen.getByRole('button', { name: /ALL/i }));
        expect(screen.getByText('Dispatch Ambulance')).toBeInTheDocument();
        expect(screen.getByText('Check Vitals')).toBeInTheDocument();
    });

    it('toggles safety checks', () => {
        render(<ActionDashboard result={mockResult} />);

        const toggleBtn = screen.getByRole('button', { name: /Safety Checks/i });
        expect(screen.queryByText('Protocol A')).not.toBeInTheDocument();

        fireEvent.click(toggleBtn);
        expect(screen.getByText('Protocol A')).toBeInTheDocument();
    });

    it('toggles raw JSON view', () => {
        render(<ActionDashboard result={mockResult} />);

        const toggleBtn = screen.getByRole('button', { name: /View Raw JSON Output/i });
        expect(screen.queryByText(/"success": true/)).not.toBeInTheDocument();

        fireEvent.click(toggleBtn);
        expect(screen.getByText(/"intent": "Medical Emergency"/)).toBeInTheDocument();
    });

    it('shows human confirmation alert if required', () => {
        const overrideResult = {
            ...mockResult,
            data: { ...mockResult.data, verification: { requires_human_confirmation: true, confidence_reasoning: 'Need review' } }
        };
        render(<ActionDashboard result={overrideResult} />);
        expect(screen.getByText(/Human Confirmation Required/i)).toBeInTheDocument();
        expect(screen.getByText(/Need review/i)).toBeInTheDocument();
    });
});
