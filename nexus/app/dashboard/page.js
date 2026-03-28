'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import VoiceInput from '@/components/inputs/VoiceInput';
import ImageUpload from '@/components/inputs/ImageUpload';
import TextInput from '@/components/inputs/TextInput';
import ActionDashboard from '@/components/outputs/ActionDashboard';
import AuditTrail from '@/components/outputs/AuditTrail';
import { analyzeInput } from '@/lib/gemini';
import styles from './dashboard.module.css';

const DOMAINS = [
    { id: 'MEDICAL', icon: '🏥', color: '#fc8181' },
    { id: 'EMERGENCY', icon: '🚨', color: '#f6ad55' },
    { id: 'TRAVEL', icon: '🚦', color: '#68d391' },
    { id: 'CRISIS', icon: '📡', color: '#b794f4' },
    { id: 'ENVIRONMENT', icon: '🌿', color: '#63b3ed' },
    { id: 'GENERAL', icon: '🧠', color: '#00d9f5' },
];

const INPUT_TABS = [
    { id: 'text', label: '💬 Text', title: 'Text / Data' },
    { id: 'voice', label: '🎤 Voice', title: 'Voice Recording' },
    { id: 'image', label: '🖼️ Image', title: 'Image / Doc' },
];

function DashboardContent() {
    const searchParams = useSearchParams();
    const initialDomain = searchParams.get('domain') || 'GENERAL';

    const [domain, setDomain] = useState(initialDomain);
    const [inputTab, setInputTab] = useState('text');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [apiKey, setApiKey] = useState('');
    const [showApiSetup, setShowApiSetup] = useState(false);
    const [feedbackMap, setFeedbackMap] = useState({});

    // Load sessions from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('intentbridge_sessions');
        if (saved) setSessions(JSON.parse(saved));
        const key = localStorage.getItem('intentbridge_apikey');
        if (key) setApiKey(key);
    }, []);

    const saveSession = (input, res) => {
        const data = res?.data;
        const newSession = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            domain: data?.domain || domain,
            intent: data?.intent || 'Unknown Intent',
            urgency: data?.urgency || 'LOW',
            confidence: data?.confidence || 0,
            actionCount: data?.actions?.length || 0,
            inputType: inputTab,
            inputPreview: typeof input === 'string' ? input.slice(0, 120) : 'Image/File',
        };
        const updated = [newSession, ...sessions].slice(0, 10);
        setSessions(updated);
        localStorage.setItem('intentbridge_sessions', JSON.stringify(updated));
    };

    const runAnalysis = async (type, content, imageBase64 = null, imageMimeType = null) => {
        const key = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!key || key === 'your_gemini_api_key_here') {
            setShowApiSetup(true);
            return;
        }
        // Temporarily inject key for client-side use
        if (apiKey) {
            process.env.NEXT_PUBLIC_GEMINI_API_KEY = apiKey;
        }

        setIsProcessing(true);
        setResult(null);

        try {
            const res = await analyzeInput({ type, content, imageBase64, imageMimeType, domain });
            setResult(res);
            saveSession(content, res);
        } catch (err) {
            if (err.message === 'GEMINI_API_KEY_MISSING') {
                setShowApiSetup(true);
            } else {
                setResult({ success: false, error: err.message });
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleTextSubmit = (text) => runAnalysis('text', text);
    const handleVoiceTranscript = (transcript) => runAnalysis('voice', transcript);
    const handleImageAnalyze = ({ base64, mimeType, caption }) =>
        runAnalysis('image', caption || 'Analyze this image', base64, mimeType);

    const handleFeedback = (actionId, type) => {
        setFeedbackMap(prev => ({ ...prev, [actionId]: type }));
    };

    const saveApiKey = () => {
        localStorage.setItem('intentbridge_apikey', apiKey);
        setShowApiSetup(false);
    };

    return (
        <div className={styles.page}>
            {/* Top Nav */}
            <nav className={styles.nav}>
                <Link href="/" className={styles.logoLink}>
                    <span className={styles.logoIcon}>🧠</span>
                    <span className={styles.logoText}>IntentBridge <span className={styles.logoAI}>AI</span></span>
                </Link>

                {/* Domain Selector */}
                <div className={styles.domainBar}>
                    {DOMAINS.map(d => (
                        <button
                            key={d.id}
                            className={`${styles.domainBtn} ${domain === d.id ? styles.domainBtnActive : ''}`}
                            style={domain === d.id ? { borderColor: d.color, color: d.color, background: `${d.color}15` } : {}}
                            onClick={() => setDomain(d.id)}
                            title={d.id}
                        >
                            {d.icon} <span className={styles.domainLabel}>{d.id}</span>
                        </button>
                    ))}
                </div>

                <button
                    className="btn btn-secondary"
                    style={{ fontSize: 13, padding: '7px 14px' }}
                    onClick={() => setShowApiSetup(true)}
                    title="Configure API Key"
                >
                    🔑 API
                </button>
            </nav>

            {/* API Key Setup Modal */}
            {showApiSetup && (
                <div className={styles.modalOverlay} onClick={() => setShowApiSetup(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <h3>🔑 Configure Gemini API Key</h3>
                        <p>
                            Get your free key from{' '}
                            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"
                                style={{ color: 'var(--accent-cyan)' }}>
                                Google AI Studio →
                            </a>
                        </p>
                        <input
                            type="password"
                            className="input-field"
                            style={{ padding: '12px 14px', marginTop: 12 }}
                            placeholder="AIzaSy..."
                            value={apiKey}
                            onChange={e => setApiKey(e.target.value)}
                            autoFocus
                        />
                        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                            <button className="btn btn-primary" onClick={saveApiKey} style={{ flex: 1 }}>
                                💾 Save & Continue
                            </button>
                            <button className="btn btn-secondary" onClick={() => setShowApiSetup(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Layout */}
            <div className={styles.main}>
                {/* Left Panel — Input */}
                <div className={styles.leftPanel}>
                    <div className={styles.panelHeader}>
                        <h2 className={styles.panelTitle}>Input</h2>
                        <span className={styles.panelSub}>Any messy real-world data</span>
                    </div>

                    {/* Input Tabs */}
                    <div className={styles.inputTabs}>
                        {INPUT_TABS.map(tab => (
                            <button
                                key={tab.id}
                                className={`${styles.inputTab} ${inputTab === tab.id ? styles.inputTabActive : ''}`}
                                onClick={() => setInputTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Input Panels */}
                    <div className={styles.inputPanel}>
                        {inputTab === 'text' && (
                            <TextInput onSubmit={handleTextSubmit} isProcessing={isProcessing} domain={domain} />
                        )}
                        {inputTab === 'voice' && (
                            <VoiceInput onTranscript={handleVoiceTranscript} isProcessing={isProcessing} />
                        )}
                        {inputTab === 'image' && (
                            <ImageUpload onImageAnalyze={handleImageAnalyze} isProcessing={isProcessing} />
                        )}
                    </div>

                    {/* Audit Trail */}
                    <div className={styles.auditSection}>
                        <AuditTrail sessions={sessions} onReplay={(s) => {
                            setDomain(s.domain);
                            // Switch to text tab and show the replay
                            setInputTab('text');
                        }} />
                    </div>
                </div>

                {/* Right Panel — Output */}
                <div className={styles.rightPanel}>
                    <div className={styles.panelHeader}>
                        <h2 className={styles.panelTitle}>Structured Output</h2>
                        <span className={styles.panelSub}>Verified • Actionable • Life-critical</span>
                    </div>
                    <div className={styles.outputArea}>
                        <ActionDashboard
                            result={result}
                            isLoading={isProcessing}
                            onFeedback={handleFeedback}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div style={{ color: 'white', padding: 40, textAlign: 'center' }}>Loading...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
