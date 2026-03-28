'use client';
import { useState } from 'react';
import styles from './AuditTrail.module.css';

const DOMAIN_ICON = {
    MEDICAL: '🏥', EMERGENCY: '🚨', TRAVEL: '🚦',
    CRISIS: '📡', ENVIRONMENT: '🌿', GENERAL: '🧠',
};

export default function AuditTrail({ sessions, onReplay }) {
    const [expanded, setExpanded] = useState(null);

    if (!sessions || sessions.length === 0) {
        return (
            <div className={styles.empty}>
                <span>📋</span>
                <span>No sessions yet. Your processed inputs will appear here.</span>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.title}>📋 Audit Trail</span>
                <span className={styles.count}>{sessions.length} sessions</span>
            </div>
            <div className={styles.list}>
                {sessions.map((session, i) => (
                    <div key={session.id} className={styles.sessionItem}>
                        <button
                            className={styles.sessionHeader}
                            onClick={() => setExpanded(expanded === session.id ? null : session.id)}
                        >
                            <div className={styles.sessionLeft}>
                                <span className={styles.sessionDomain}>
                                    {DOMAIN_ICON[session.domain] || '🧠'} {session.domain}
                                </span>
                                <span className={styles.sessionIntent}>{session.intent || session.inputPreview}</span>
                            </div>
                            <div className={styles.sessionRight}>
                                <span className={`badge badge-${(session.urgency || 'LOW').toLowerCase()}`}>
                                    {session.urgency}
                                </span>
                                <span className={styles.sessionTime}>
                                    {new Date(session.timestamp).toLocaleTimeString()}
                                </span>
                                <span>{expanded === session.id ? '▲' : '▼'}</span>
                            </div>
                        </button>
                        {expanded === session.id && (
                            <div className={styles.sessionDetails}>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Input Type:</span>
                                    <span>{session.inputType}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Confidence:</span>
                                    <span style={{ color: 'var(--accent-green)' }}>{session.confidence}%</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Actions Generated:</span>
                                    <span>{session.actionCount}</span>
                                </div>
                                {session.inputPreview && (
                                    <div className={styles.inputPreview}>
                                        <span className={styles.detailLabel}>Input:</span>
                                        <span className={styles.previewText}>{session.inputPreview}</span>
                                    </div>
                                )}
                                <button
                                    className="btn btn-secondary"
                                    style={{ fontSize: 12, padding: '6px 14px', marginTop: 8 }}
                                    onClick={() => onReplay && onReplay(session)}
                                >
                                    ↩ Replay Session
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
