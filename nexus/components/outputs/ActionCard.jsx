'use client';
import styles from './ActionCard.module.css';

const URGENCY_ICON = { CRITICAL: '🔴', HIGH: '🟠', MEDIUM: '🟡', LOW: '🟢' };
const CATEGORY_ICON = {
    CALL: '📞', NAVIGATE: '🗺️', ALERT: '🔔', SCHEDULE: '📅', INFORM: 'ℹ️', VERIFY: '✅'
};

export default function ActionCard({ action, index, onFeedback }) {
    const urgency = action.urgency || 'MEDIUM';
    const urgencyClass = urgency.toLowerCase();

    return (
        <div
            className={`${styles.card} ${styles['card_' + urgencyClass]}`}
            style={{ animationDelay: `${index * 0.08}s` }}
        >
            {/* Header */}
            <div className={styles.cardHeader}>
                <div className={styles.leftHeader}>
                    <span className={styles.categoryIcon}>
                        {CATEGORY_ICON[action.category] || '⚡'}
                    </span>
                    <div>
                        <div className={styles.actionTitle}>{action.title}</div>
                        <div className={styles.actionTarget}>→ {action.target}</div>
                    </div>
                </div>
                <div className={styles.rightHeader}>
                    <span className={`badge badge-${urgencyClass}`}>
                        {URGENCY_ICON[urgency]} {urgency}
                    </span>
                    {action.priority && (
                        <span className={styles.priority}>P{action.priority}</span>
                    )}
                </div>
            </div>

            {/* Description */}
            <p className={styles.description}>{action.description}</p>

            {/* Safety Note */}
            {action.safetyNote && (
                <div className={styles.safetyNote}>
                    🛡️ <span>{action.safetyNote}</span>
                </div>
            )}

            {/* Footer */}
            <div className={styles.cardFooter}>
                <div className={styles.tags}>
                    {action.verified && <span className={styles.tag} style={{ color: 'var(--accent-green)' }}>✅ Verified</span>}
                    {action.automated && <span className={styles.tag} style={{ color: 'var(--accent-cyan)' }}>🤖 Automated</span>}
                    {!action.automated && <span className={styles.tag} style={{ color: 'var(--text-muted)' }}>👤 Manual</span>}
                </div>
                <div className={styles.feedbackBtns}>
                    <button
                        className={styles.feedbackBtn}
                        onClick={() => onFeedback && onFeedback(action.id, 'helpful')}
                        title="This was helpful"
                    >👍</button>
                    <button
                        className={styles.feedbackBtn}
                        onClick={() => onFeedback && onFeedback(action.id, 'not_helpful')}
                        title="This was not helpful"
                    >👎</button>
                </div>
            </div>
        </div>
    );
}
