<div align="center">
  <h1>🧠 IntentBridge AI</h1>
  <p><strong>Turning Human Chaos into Life-Saving Actions</strong></p>
  <p>
    A Gemini-powered universal AI bridge that converts messy, unstructured real-world inputs<br/>
    (voice, images, medical documents, traffic data, news) into structured, verified, life-saving actions.
  </p>

  <p>
    <a href="https://github.com/your-username/intentbridge-ai/actions"><img src="https://github.com/your-username/intentbridge-ai/actions/workflows/ci.yml/badge.svg" alt="CI Build"/></a>
    <img src="https://img.shields.io/badge/Gemini-2.0_Flash-4285F4?logo=google&logoColor=white" alt="Gemini"/>
    <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js"/>
    <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT"/>
  </p>
</div>

---

## 🎯 What It Does

IntentBridge AI accepts **any messy real-world input** and instantly produces **structured, verified action plans** across 5 life-critical domains:

| Domain | Example Input | Output |
|---|---|---|
| 🏥 **Medical Emergency** | *"dad sweating not responding highway 5"* | Triage plan, call 911, nearest cardiac unit |
| 🚨 **Disaster Response** | *"crash on highway, two trapped, fire spreading"* | Emergency dispatch, evacuation route |
| 🚦 **Smart Travel** | *"need airport by 3pm, traffic crazy"* | Best route, ETA, alerts |
| 📡 **Crisis Intelligence** | *"conflicting flood reports downtown"* | Verified summary, safety advisory |
| 🌿 **Environment** | *"AQI 287, kid has asthma"* | Health risk, protective actions |

---

## ✨ Features

- 🎤 **Voice Input** — Web Speech API with live waveform visualizer
- 🖼️ **Gemini Vision** — Upload photos, medical scans, accident images
- 💬 **Text / Data Streams** — Messy text, JSON feeds, weather/traffic data
- 🧠 **Gemini 2.0 Flash** — Intent extraction, entity recognition, urgency scoring
- ✅ **Verification Layer** — Confidence scores, hallucination flags, safety checks
- ⚡ **Structured Action Cards** — Color-coded by urgency (Critical / High / Medium / Low)
- 📋 **Audit Trail** — Full timestamped session history
- 📄 **Raw JSON Export** — Inspect Gemini's full structured output

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/your-username/intentbridge-ai.git
cd intentbridge-ai
npm install
```

### 2. Set Up API Key
Get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey), then:
```bash
cp .env.example .env.local
# Edit .env.local and replace 'your_gemini_api_key_here' with your real key
```

### 3. Run Locally
```bash
npm run dev
# Open http://localhost:3000
```

---

## 🌐 Deploy to Google Cloud Run

This project is fully containerized for Cloud Run. Push to `main` and GitHub Actions handles the rest.

### 1. Set up GitHub Secrets

In your GitHub repo → **Settings → Secrets and variables → Actions**, add:

| Secret | Value |
|---|---|
| `GCP_PROJECT_ID` | Your GCP project ID (e.g. `my-project-123`) |
| `GCP_SA_KEY` | JSON key of a Service Account with roles: `Cloud Run Admin`, `Storage Admin`, `Service Account User` |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey) |

### 2. Push to GitHub

```bash
git push origin main
```

The workflow in `.github/workflows/deploy.yml` will automatically:
1. Build the Docker image (`Dockerfile`)
2. Push to Google Container Registry (`gcr.io`)
3. Deploy to Cloud Run in `us-central1`

### 3. Manually deploy (optional)

```bash
# Build & push
docker build --build-arg NEXT_PUBLIC_GEMINI_API_KEY=your_key -t gcr.io/YOUR_PROJECT/intentbridge-ai .
docker push gcr.io/YOUR_PROJECT/intentbridge-ai

# Deploy
gcloud run deploy intentbridge-ai \
  --image gcr.io/YOUR_PROJECT/intentbridge-ai \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080
```

> ⚙️ To change the region, edit `REGION` in `.github/workflows/deploy.yml`.

---

## 🏗️ Project Structure

```
nexus/
├── app/
│   ├── page.js              # Hero landing page
│   ├── dashboard/           # Main app dashboard
│   │   └── page.js
│   └── globals.css          # Design system (dark glassmorphism)
├── components/
│   ├── inputs/
│   │   ├── VoiceInput.jsx   # Web Speech API + waveform
│   │   ├── ImageUpload.jsx  # Drag-and-drop → Gemini Vision
│   │   └── TextInput.jsx    # Freeform text + quick examples
│   └── outputs/
│       ├── ActionCard.jsx   # Urgency-coded action cards
│       ├── ActionDashboard.jsx  # Full output panel
│       └── AuditTrail.jsx   # Session history
├── lib/
│   ├── gemini.js            # Gemini API orchestration layer
│   └── prompts.js           # Domain-specific system prompts
├── .env.example             # Safe env template (commit this)
├── .env.local               # Your real key (gitignored)
└── vercel.json              # Vercel deployment config
```

---

## ⚙️ Architecture

```
[Any Input: Voice / Image / Text / Data]
         ↓
[Input Processor — type detection, base64 encoding]
         ↓
[Gemini 2.0 Flash — domain-specific prompt routing]
         ↓
[Structured JSON: intent, urgency, entities, actions, safety]
         ↓
[Verification Layer — confidence score, hallucination flags]
         ↓
[Action Cards — color-coded, filterable, auditable]
```

---

## 🔒 Security & Privacy

- **API key is never logged or stored server-side** — it lives only in your `.env.local` or Vercel env vars
- **Runtime key entry** — users can enter their own key via the UI for a shared deployment
- **No hallucinated actions** — every output includes a confidence score and requires human confirmation for CRITICAL urgency
- `.env*` is gitignored — secrets **never** reach GitHub

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **AI**: Google Gemini 2.0 Flash (`@google/generative-ai`)
- **Styling**: Vanilla CSS (custom dark glassmorphism design system)
- **Voice**: Web Speech API (browser-native, no backend)
- **Vision**: Gemini multimodal (base64 image encoding)

---

## 📄 License

MIT — free to use, fork, and deploy.

---

<div align="center">
  <p>Built with ❤️ for societal benefit • Powered by Google Gemini</p>
</div>
