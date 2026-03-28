"use client";
import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import ActionCard from "./ActionCard";
import styles from "./ActionDashboard.module.css";

export default function ActionDashboard({ result, isLoading, onFeedback }) {
  const [filter, setFilter] = useState("ALL");
  const [showVerification, setShowVerification] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingOrb} />
        <div className={styles.loadingSpinner} />
        <div className={styles.loadingTitle}>Gemini is Processing...</div>
        <div className={styles.loadingSteps}>
          {[
            "🎯 Extracting Intent",
            "🧠 Understanding Context",
            "✅ Verifying Actions",
            "⚡ Generating Plan",
          ].map((step, i) => (
            <div
              key={step}
              className={styles.loadingStep}
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              {step}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🧠</div>
        <div className={styles.emptyTitle}>Ready for Input</div>
        <div className={styles.emptyDesc}>
          Add a voice message, upload an image, or type any messy real-world
          text on the left. IntentBridge AI will instantly convert it into
          structured, verified actions.
        </div>
        <div className={styles.emptyFeatures}>
          {[
            "Medical Triage",
            "Emergency Dispatch",
            "Traffic Routing",
            "Crisis Intel",
            "Environmental Alerts",
          ].map((f) => (
            <span key={f} className="chip">
              {f}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (!result.success) {
    return (
      <div className={styles.errorState}>
        <div className={styles.errorIcon}>⚠️</div>
        <div className={styles.errorTitle}>Analysis Failed</div>
        <div className={styles.errorDesc}>{result.error}</div>
        {result.raw && <pre className={styles.rawOutput}>{result.raw}</pre>}
      </div>
    );
  }

  const data = result.data;
  const actions = data.actions || [];

  const filtered = useMemo(() => {
    return filter === "ALL" ? actions : actions.filter((a) => a.urgency === filter);
  }, [actions, filter]);

  const urgencyCounts = useMemo(() => {
    return actions.reduce((acc, a) => {
      acc[a.urgency] = (acc[a.urgency] || 0) + 1;
      return acc;
    }, {});
  }, [actions]);

  const confidenceColor = useMemo(() => {
    if (data.confidence >= 80) return "var(--accent-green)";
    if (data.confidence >= 50) return "var(--urgency-medium)";
    return "var(--urgency-critical)";
  }, [data.confidence]);

  return (
    <div className={styles.dashboard}>
      {/* Summary Header */}
      <div
        className={`${styles.summaryHeader} domain-bg-${data.domain || "GENERAL"}`}
      >
        <div className={styles.summaryLeft}>
          <div className={styles.intentText}>{data.intent}</div>
          <div className={styles.summaryMeta}>
            <span
              className={`badge badge-${(data.urgency || "LOW").toLowerCase()}`}
            >
              {data.urgency}
            </span>
            <span className={`chip domain-${data.domain || "GENERAL"}`}>
              {data.domain}
            </span>
            <span className={styles.actionCount}>{actions.length} actions</span>
          </div>
        </div>
        <div className={styles.confidenceBlock}>
          <div
            className={styles.confidenceValue}
            style={{ color: confidenceColor }}
          >
            {data.confidence}%
          </div>
          <div className={styles.confidenceLabel}>Confidence</div>
          <div className="confidence-bar" style={{ width: 60 }}>
            <div
              className="confidence-fill"
              style={{
                width: `${data.confidence}%`,
                background: confidenceColor,
              }}
            />
          </div>
        </div>
      </div>

      {/* Verification Alert */}
      {data.verification?.requires_human_confirmation && (
        <div className={styles.confirmAlert}>
          ⚠️ <strong>Human Confirmation Required</strong> — Review all actions
          before executing.
          {data.verification.confidence_reasoning && (
            <span> {data.verification.confidence_reasoning}</span>
          )}
        </div>
      )}

      {/* Key Facts */}
      {data.structuredData?.keyFacts?.length > 0 && (
        <div className={styles.factsList}>
          <div className={styles.sectionLabel}>📋 Key Facts Extracted</div>
          <div className={styles.facts}>
            {data.structuredData.keyFacts.map((f, i) => (
              <div key={i} className={styles.fact}>
                · {f}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Entities */}
      {data.entities && (
        <div className={styles.entities}>
          {Object.entries(data.entities).map(([key, vals]) =>
            vals?.length > 0 ? (
              <div key={key} className={styles.entityGroup}>
                <span className={styles.entityKey}>{key}:</span>
                {vals.map((v, i) => (
                  <span key={i} className="chip">
                    {v}
                  </span>
                ))}
              </div>
            ) : null,
          )}
        </div>
      )}

      {/* Filter Bar */}
      {actions.length > 1 && (
        <div className={styles.filters}>
          {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ""}`}
            >
              {f}{" "}
              {f !== "ALL" && urgencyCounts[f] ? `(${urgencyCounts[f]})` : ""}
            </button>
          ))}
        </div>
      )}

      {/* Action Cards */}
      <div className={styles.actionsList}>
        <div className={styles.sectionLabel}>⚡ Recommended Actions</div>
        {filtered.length === 0 ? (
          <div className={styles.noActions}>
            No actions with this urgency level
          </div>
        ) : (
          filtered.map((action, i) => (
            <ActionCard
              key={action.id || i}
              action={action}
              index={i}
              onFeedback={onFeedback}
            />
          ))
        )}
      </div>

      {/* Safety Checks */}
      {data.safetyChecks?.length > 0 && (
        <div className={styles.safetySection}>
          <button
            className={styles.toggleBtn}
            onClick={() => setShowVerification(!showVerification)}
          >
            🛡️ Safety Checks ({data.safetyChecks.filter((s) => s.passed).length}
            /{data.safetyChecks.length} passed)
            <span>{showVerification ? "▲" : "▼"}</span>
          </button>
          {showVerification && (
            <div className={styles.safetyList}>
              {data.safetyChecks.map((check, i) => (
                <div
                  key={i}
                  className={`${styles.safetyItem} ${check.passed ? styles.safetyPassed : styles.safetyFailed}`}
                >
                  {check.passed ? "✅" : "❌"} <strong>{check.check}</strong>
                  {check.note && (
                    <span className={styles.safetyNote}> — {check.note}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Feedback */}
      {data.feedback_prompt && (
        <div className={styles.feedbackSection}>
          <div className={styles.feedbackPrompt}>💬 {data.feedback_prompt}</div>
        </div>
      )}

      {/* Raw JSON toggle */}
      <button className={styles.toggleBtn} onClick={() => setShowRaw(!showRaw)}>
        📄 View Raw JSON Output <span>{showRaw ? "▲" : "▼"}</span>
      </button>
      {showRaw && (
        <pre className={styles.rawOutput}>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
