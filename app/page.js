"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const DOMAINS = [
  {
    id: "MEDICAL",
    icon: "🏥",
    title: "Medical Emergency",
    desc: "Triage symptoms, extract vitals, recommend urgent care",
    color: "#fc8181",
    example: '"Patient 67F, sweating, chest pain, BP 190/110, unknown meds"',
  },
  {
    id: "EMERGENCY",
    icon: "🚨",
    title: "Disaster Response",
    desc: "Accident detection, evacuation routing, emergency dispatch",
    color: "#f6ad55",
    example: '"Car crash on highway 5, two trapped, fire spreading"',
  },
  {
    id: "TRAVEL",
    icon: "🚦",
    title: "Smart Travel",
    desc: "Traffic analysis, optimal routing, civic infrastructure",
    color: "#68d391",
    example: '"Need airport by 3pm, downtown traffic crazy, raining"',
  },
  {
    id: "CRISIS",
    icon: "📡",
    title: "Crisis Intelligence",
    desc: "Verify breaking news, flag misinformation, situational awareness",
    color: "#b794f4",
    example: '"Conflicting reports of flooding in riverside district"',
  },
  {
    id: "ENVIRONMENT",
    icon: "🌿",
    title: "Environmental Health",
    desc: "AQI analysis, pollution alerts, health risk assessment",
    color: "#63b3ed",
    example: '"AQI 287, my kid has asthma, what do I do"',
  },
];

const DEMO_STREAM = [
  {
    delay: 0,
    text: '📥 Input: "dad sweating not responding highway 5"',
    type: "input",
  },
  { delay: 1200, text: "🧠 Detecting intent...", type: "process" },
  {
    delay: 2200,
    text: "⚡ Intent: Medical Emergency • Severity: CRITICAL",
    type: "output",
  },
  { delay: 3000, text: "✅ Action: Call 911 immediately", type: "action" },
  {
    delay: 3600,
    text: "✅ Action: Locate nearest cardiac unit",
    type: "action",
  },
  { delay: 4200, text: "✅ Action: Alert family members", type: "action" },
  {
    delay: 5000,
    text: "📥 Input: [PDF — Medical History Upload]",
    type: "input",
  },
  { delay: 6200, text: "🧠 Extracting medical entities...", type: "process" },
  {
    delay: 7200,
    text: "⚡ Found: Diabetes, Hypertension, Metformin 500mg",
    type: "output",
  },
  {
    delay: 8000,
    text: "✅ Action: Drug interaction check — flagged",
    type: "action",
  },
  { delay: 8800, text: "✅ Action: Recommend endocrinologist", type: "action" },
];

export default function HomePage() {
  const [demoItems, setDemoItems] = useState([]);
  const demoRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let timeouts = [];
    const run = () => {
      setDemoItems([]);
      DEMO_STREAM.forEach((item, i) => {
        const t = setTimeout(() => {
          setDemoItems((prev) => [...prev, item]);
          if (demoRef.current) {
            demoRef.current.scrollTop = demoRef.current.scrollHeight;
          }
        }, item.delay);
        timeouts.push(t);
      });
      // Loop
      const loop = setTimeout(run, 12000);
      timeouts.push(loop);
    };
    run();
    return () => timeouts.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.page}>
      {/* Background orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      {/* Nav */}
      <nav
        className={styles.nav}
        style={{
          background: scrollY > 20 ? "rgba(8,11,20,0.9)" : "transparent",
        }}
      >
        <div className={styles.navInner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🧠</span>
            <span className={styles.logoText}>
              IntentBridge <span className={styles.logoAI}>AI</span>
            </span>
          </div>
          <div className={styles.navLinks}>
            <span className={styles.navBadge}>Powered by Gemini</span>
            <Link href="/dashboard" className="btn btn-primary">
              Launch App →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Universal AI Bridge • Gemini-Powered • Life-Saving
          </div>

          <h1 className={styles.heroTitle}>
            Turning Human <span className={styles.heroHighlight}>Chaos</span>{" "}
            into{" "}
            <span className={styles.heroHighlight2}>Life&#8209;Saving</span>{" "}
            Actions
          </h1>

          <p className={styles.heroSub}>
            Throw any messy real&#8209;world input at IntentBridge AI — voice,
            photos, medical history, traffic data, breaking news — and instantly
            get structured, verified, actionable outputs that connect humans to
            the systems that matter most.
          </p>

          <div className={styles.heroCTA}>
            <Link
              href="/dashboard"
              className="btn btn-primary"
              style={{ fontSize: 16, padding: "14px 32px" }}
            >
              🚀 Launch Dashboard
            </Link>
            <a
              href="#domains"
              className="btn btn-secondary"
              style={{ fontSize: 16, padding: "14px 28px" }}
            >
              See Use Cases
            </a>
          </div>

          <div className={styles.heroStats}>
            {[
              { value: "5", label: "Life-Critical Domains" },
              { value: "∞", label: "Input Formats" },
              { value: "<2s", label: "Response Time" },
              { value: "100%", label: "Safety Verified" },
            ].map((s) => (
              <div key={s.label} className={styles.heroStat}>
                <span className={styles.heroStatValue}>{s.value}</span>
                <span className={styles.heroStatLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Demo Terminal */}
        <div className={styles.heroDemo}>
          <div className={styles.demoPill}>● LIVE DEMO</div>
          <div className={styles.demoWindow}>
            <div className={styles.demoWindowBar}>
              <div className={styles.dot} style={{ background: "#ff5f57" }} />
              <div className={styles.dot} style={{ background: "#febc2e" }} />
              <div className={styles.dot} style={{ background: "#28c840" }} />
              <span className={styles.demoWindowTitle}>
                IntentBridge AI — Live Processing
              </span>
            </div>
            <div className={styles.demoBody} ref={demoRef}>
              {demoItems.map((item, i) => (
                <div
                  key={i}
                  className={`${styles.demoLine} ${styles["demoLine_" + item.type]}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {item.text}
                </div>
              ))}
              <div className={styles.demoCursor} />
            </div>
          </div>
        </div>
      </section>

      {/* Domains */}
      <section id="domains" className={styles.domains}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>5 Life-Critical Domains</h2>
          <p className={styles.sectionSub}>
            One AI, infinite real-world scenarios. IntentBridge intelligently
            routes your input to the right domain and generates precise,
            verified actions.
          </p>
        </div>

        <div className={styles.domainGrid}>
          {DOMAINS.map((d, i) => (
            <Link
              href={`/dashboard?domain=${d.id}`}
              key={d.id}
              className={`${styles.domainCard} glass-card`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className={styles.domainIcon}
                style={{
                  background: `${d.color}18`,
                  borderColor: `${d.color}30`,
                }}
              >
                {d.icon}
              </div>
              <h3 className={styles.domainTitle} style={{ color: d.color }}>
                {d.title}
              </h3>
              <p className={styles.domainDesc}>{d.desc}</p>
              <div className={styles.domainExample}>
                <span className={styles.domainExampleLabel}>
                  Example input:
                </span>
                <span className={styles.domainExampleText}>{d.example}</span>
              </div>
              <div className={styles.domainArrow} style={{ color: d.color }}>
                Try this domain →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className={styles.howItWorks}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionSub}>
            Four intelligent layers, zero manual structuring
          </p>
        </div>

        <div className={styles.pipeline}>
          {[
            {
              n: "01",
              icon: "🎯",
              title: "Ingest Any Input",
              desc: "Voice, images, text, PDFs, data streams — any format accepted",
            },
            {
              n: "02",
              icon: "🧠",
              title: "Gemini Understands",
              desc: "Extracts intent, urgency, entities and context with high accuracy",
            },
            {
              n: "03",
              icon: "✅",
              title: "Verify & Validate",
              desc: "Cross-checks facts, removes hallucinations, assigns confidence scores",
            },
            {
              n: "04",
              icon: "⚡",
              title: "Actionable Output",
              desc: "Structured JSON actions with urgency levels, safety notes, and next steps",
            },
          ].map((step, i) => (
            <div key={step.n} className={styles.pipelineStep}>
              <div className={styles.pipelineNum}>{step.n}</div>
              <div className={styles.pipelineIcon}>{step.icon}</div>
              <div className={styles.pipelineContent}>
                <h4 className={styles.pipelineTitle}>{step.title}</h4>
                <p className={styles.pipelineDesc}>{step.desc}</p>
              </div>
              {i < 3 && <div className={styles.pipelineArrow}>→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaGlow} />
        <h2 className={styles.ctaTitle}>Ready to bridge the gap?</h2>
        <p className={styles.ctaSub}>
          Start processing real-world chaos into life-saving actions
        </p>
        <Link
          href="/dashboard"
          className="btn btn-primary"
          style={{ fontSize: 17, padding: "16px 40px" }}
        >
          🚀 Open IntentBridge AI
        </Link>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🧠</span>
          <span className={styles.logoText}>
            IntentBridge <span className={styles.logoAI}>AI</span>
          </span>
        </div>
        <p className={styles.footerText}>
          Powered by Google Gemini 2.0 Flash • Built for societal benefit
        </p>
      </footer>
    </div>
  );
}
