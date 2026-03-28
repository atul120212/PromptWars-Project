'use client';
import { useState } from 'react';
import { DOMAIN_EXAMPLES } from '@/lib/prompts';
import styles from './TextInput.module.css';

const DATA_STREAM_EXAMPLES = [
    {
        label: '🌦️ Weather Alert',
        content: `Weather Data: {"temperature": 38, "humidity": 95, "windSpeed": 85, "condition": "Severe Thunderstorm", "alerts": ["Flash Flood Warning", "Tornado Watch"], "location": "Riverside County"}`,
    },
    {
        label: '🚦 Traffic Data',
        content: `Traffic Feed: Highway 101 N — accident at mile marker 42. 3 vehicles involved. Lane 2 & 3 blocked. Backup: 8 miles. EMS on scene. Alternate Route: US-1 recommended. Travel time: +47 min.`,
    },
    {
        label: '📰 News Crisis',
        content: `Breaking: Multiple reports of gas leak at downtown station. Social media: "can't breathe near 5th ave", "evacuating building", authorities not confirmed yet. Air quality readings spiking.`,
    },
    {
        label: '🏥 Medical History',
        content: `Patient notes: 67 yr old female. Hx: T2DM (2015), HTN (2018), CAD (2020). Meds: Metformin 500mg BD, Lisinopril 10mg OD, Aspirin 81mg. Last HbA1c: 8.2 (3 months ago). c/o: chest tightness, diaphoresis x 30 min.`,
    },
];

export default function TextInput({ onSubmit, isProcessing, domain }) {
    const [text, setText] = useState('');
    const [charCount, setCharCount] = useState(0);

    const handleChange = (e) => {
        setText(e.target.value);
        setCharCount(e.target.value.length);
    };

    const handleSubmit = () => {
        if (text.trim() && onSubmit) onSubmit(text.trim());
    };

    const loadExample = (content) => {
        setText(content);
        setCharCount(content.length);
    };

    const loadDomainExample = () => {
        const ex = DOMAIN_EXAMPLES[domain] || DOMAIN_EXAMPLES.GENERAL;
        // strip quotes if present
        const clean = ex.replace(/^"/, '').replace(/"$/, '');
        setText(clean);
        setCharCount(clean.length);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.label}>💬 Text / Data Input</span>
                <span className={styles.charCount}>{charCount} chars</span>
            </div>

            <textarea
                className="input-field"
                style={{ minHeight: 140, padding: '14px 16px' }}
                placeholder={DOMAIN_EXAMPLES[domain] || DOMAIN_EXAMPLES.GENERAL}
                value={text}
                onChange={handleChange}
                disabled={isProcessing}
            />

            {/* Quick load examples */}
            <div className={styles.quickLoads}>
                <span className={styles.quickLabel}>Load example:</span>
                <button className="btn btn-secondary" style={{ fontSize: 12, padding: '5px 12px' }} onClick={loadDomainExample}>
                    ✨ Domain Example
                </button>
                {DATA_STREAM_EXAMPLES.map(ex => (
                    <button
                        key={ex.label}
                        className="btn btn-secondary"
                        style={{ fontSize: 12, padding: '5px 12px' }}
                        onClick={() => loadExample(ex.content)}
                    >
                        {ex.label}
                    </button>
                ))}
            </div>

            <div className={styles.actions}>
                <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={isProcessing || !text.trim()}
                    style={{ flex: 1 }}
                >
                    {isProcessing ? '⏳ Analyzing...' : '⚡ Analyze Input'}
                </button>
                <button className="btn btn-secondary" onClick={() => { setText(''); setCharCount(0); }} disabled={isProcessing}>
                    🗑 Clear
                </button>
            </div>
        </div>
    );
}
