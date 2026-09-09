# 🚀 TrueVoice 2.0: Production Deployment & Infrastructure Guide

This guide covers deploying **TrueVoice** across enterprise telecom environments, cloud platforms (Render, Railway, AWS/GCP, Docker), and standalone Linux/Windows servers.

---

## 🏛️ Deployment Architecture Options

```
OPTION 1: UNIFIED SINGLE-PORT CONTAINER (Recommended)
┌─────────────────────────────────────────────────────────┐
│               TrueVoice Docker Container                │
│                                                         │
│  Port 8000 ─► Python Multi-Threaded Gateway             │
│                ├─► Static SPA: / (Built React Assets)   │
│                ├─► REST API:   /api/voice/*             │
│                └─► WebSocket:  /ws/voice-stream         │
│                     │                                   │
│                     ▼                                   │
│              4-Tier Zero-Trust DSP & ML Engine          │
│              (MagicNet + LFCC + MGAA + LMT 8-12Hz)      │
└─────────────────────────────────────────────────────────┘

OPTION 2: DECOUPLED CLOUD (Vercel Frontend + Render/AWS Backend)
┌───────────────────────────┐         ┌───────────────────────────┐
│   Vercel Edge Network     │         │      Render / AWS EC2     │
│   React SPA Frontend      │ ──────► │   Python FastAPI Backend  │
│   https://truevoice.app   │         │   https://api.truevoice.in│
└───────────────────────────┘         └───────────────────────────┘
```

---

## 📦 Option 1: 1-Click Cloud Deployment via Render

TrueVoice includes a pre-configured `render.yaml` blueprint.

1. Push your repository to GitHub: `https://github.com/Rajtiwari0202/TrueVoice`
2. Log in to [Render.com](https://render.com) and click **New > Blueprint**.
3. Select your `TrueVoice` repository.
4. Render will automatically read `render.yaml`, execute the multi-stage Docker build, and deploy the service with:
   - **Health Check Path:** `/api/voice/health`
   - **Port:** `8000`
   - **Automatic HTTPS SSL Certificate**

---

## 🐳 Option 2: Docker / Docker Compose Deployment

The root `Dockerfile` builds both the React frontend and Python backend into a single lightweight image (`python:3.11-slim` + `node:20-alpine`).

### Build & Run Locally:
```bash
# 1. Build the unified image
docker build -t truevoice-engine:latest .

# 2. Run the container on port 8000
docker run -d -p 8000:8000 --name truevoice truevoice-engine:latest

# 3. Verify health
curl http://localhost:8000/api/voice/health
```

---

## 🖥️ Option 3: Standalone VPS / Local Server (Linux or Windows)

### 1. Build Frontend Production Bundle:
```bash
cd frontend
npm install
npm run build
```
This compiles the high-performance assets into `frontend/dist/`.

### 2. Run the Unified Production Server:
```bash
cd ../backend
python server.py
```
`server.py` will automatically detect `../frontend/dist/` and serve the **React Single Page Application** at `http://localhost:8000/` while handling all `/api/voice/*` requests simultaneously!

---

## 🌐 Option 4: Production Nginx Reverse Proxy Config

For enterprise deployments behind Nginx with SSL and WebSocket termination:

```nginx
server {
    listen 80;
    server_name truevoice.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name truevoice.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/truevoice.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/truevoice.yourdomain.com/privkey.pem;

    # Static Assets & React SPA
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket Real-Time Audio Streaming
    location /ws/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
```

---

## 📞 Option 5: SIP Trunk / Telecom PBX Interception (Asterisk & FreeSWITCH)

TrueVoice hooks directly into PBX call routing using the **RTP AudioSocket** protocol:

1. **FreeSWITCH `mod_audio_fork`:**
   ```xml
   <action application="fork_audio" data="start 16k ws://127.0.0.1:8000/ws/voice-stream"/>
   ```
2. **Automated Defense Reaction:**
   - If TrueVoice emits `verdict: "BLOCK"` with `is_synthetic: true`:
   - FreeSWITCH triggers an instant event hook:
     ```bash
     fs_cli -x "uuid_kill <call_uuid> CALL_REJECTED_SYNTHETIC_IMPERSONATION"
     ```
   - Triggers automated webhook to Core Banking API:
     ```bash
     curl -X POST https://bank.internal/api/v1/freeze-account \
       -H "Authorization: Bearer ${API_KEY}" \
       -d '{"caller_phone": "+919811234567", "reason": "AI_VOICE_CLONE_DETECTED"}'
     ```
