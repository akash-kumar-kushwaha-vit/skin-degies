# SkinDegies AI — Skin Disease Detection & Report Platform

![SkinDegies AI](https://img.shields.io/badge/Model-EfficientNetV2--S-blue?style=for-the-badge)
![Validation Accuracy](https://img.shields.io/badge/Validation%20Accuracy-81.56%25-emerald?style=for-the-badge)
![Top-3 Accuracy](https://img.shields.io/badge/Top--3%20Accuracy-89.75%25-purple?style=for-the-badge)
![Classes](https://img.shields.io/badge/Classes-22-amber?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

SkinDegies AI is a production-ready, full-stack microservices application designed for automated skin lesion analysis and report generation. It uses a fine-tuned **EfficientNetV2-S** PyTorch model to classify skin lesions across 22 classes, paired with **Gemini 2.5 Flash** (or OpenAI GPT-4o) to generate structured clinical reports based on patient questionnaire answers.

---

## 🌟 Features

- **Deep Learning Model**: EfficientNetV2-S trained on 22 skin disease classes with 81.56% validation accuracy and 89.75% top-3 accuracy.
- **Instant Top-3 Predictions**: Returns confidence percentages and bar chart visualization in under 2 seconds.
- **Clinical Questionnaire**: Captures age, gender, duration, pain, itching, burning, bleeding, swelling, fever, family history, and systemic factors.
- **Provider-Agnostic LLM Medical Reports**: Generates structured reports via Gemini 2.5 Flash (switchable to OpenAI via configuration).
- **Modern Medical Dashboard**: Patient history, report print/export, analytics, and disease distribution.
- **Role-Based Admin Panel**: Manage users, enable/disable accounts, view system-wide prediction logs and analytics.
- **Production Security**: Helmet headers, rate limiting, JWT authentication (access + refresh tokens), bcrypt password hashing, Multer file validation.
- **Verified Signup**: New accounts must confirm their email address through a time-limited link before signing in.

---

## 🏗️ Architecture Stack

| Tier | Technology | Host Target |
|---|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Recharts | Vercel |
| **Backend** | Node.js, Express.js, JWT, Helmet, Multer, Winston | Render |
| **AI Microservice** | Python 3.11, FastAPI, PyTorch, torchvision, Pillow | Railway |
| **Database** | MongoDB Atlas, Mongoose ORM | MongoDB Atlas |
| **LLM Provider** | Gemini 2.5 Flash (or OpenAI GPT-4o) | Google AI Studio |

---

## 📁 Repository Structure

```
skin-degies/
├── ai-model/          # FastAPI PyTorch microservice (Port 8000)
│   ├── checkpoints/   # Model weights (best_model.pth)
│   ├── models/        # EfficientNetV2-S architecture definition
│   ├── routers/       # POST /predict and GET /health endpoints
│   ├── services/      # Inference engine & image preprocessing
│   ├── main.py        # FastAPI entry point
│   ├── Dockerfile     # Docker build script
│   └── requirements.txt
├── backend/           # Node.js Express REST API (Port 5000)
│   ├── config/        # MongoDB & Swagger docs configuration
│   ├── controllers/   # Auth, Prediction, Admin, User controllers
│   ├── middleware/    # JWT auth, Multer upload, Rate limit, Validation
│   ├── models/        # Mongoose schemas (User, Prediction, Report, etc.)
│   ├── routes/        # Express route definitions
│   ├── services/      # AI Proxy & LLM Service (Gemini/OpenAI)
│   └── server.js      # Express server entry point
├── frontend/          # React Vite Web App (Port 5173)
│   ├── src/
│   │   ├── components/ # Reusable UI, prediction charts, questionnaire
│   │   ├── context/    # Auth & Theme providers
│   │   ├── pages/      # Landing, Auth, Dashboard, Predict, Admin
│   │   └── services/   # Axios API client
│   └── tailwind.config.js
├── docs/              # System architecture & API documentation
└── README.md
```

---

## 22 Skin Disease Classes

`Acne`, `Actinic_Keratosis`, `Benign_tumors`, `Bullous`, `Candidiasis`, `DrugEruption`, `Eczema`, `Infestations_Bites`, `Lichen`, `Lupus`, `Moles`, `Psoriasis`, `Rosacea`, `Seborrh_Keratoses`, `SkinCancer`, `Sun_Sunlight_Damage`, `Tinea`, `Unknown_Normal`, `Vascular_Tumors`, `Vasculitis`, `Vitiligo`, `Warts`.

---

## 🚀 Quick Start Guide

### 1. Model Setup (AI Microservice)
Place your trained checkpoint at `ai-model/checkpoints/best_model.pth`.

```bash
cd ai-model
python -m venv venv
source venv/bin/activate  # Or venv\Scripts\activate on Windows
pip install -r requirements.txt
python main.py
```
*FastAPI runs on `http://localhost:8000` (Docs: `http://localhost:8000/docs`)*

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Update MONGODB_URI and GEMINI_API_KEY in .env
npm install
npm run seed  # Creates initial admin user
npm run dev
```
*Backend runs on `http://localhost:5000` (Docs: `http://localhost:5000/api/docs`)*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🔒 Security & Environment Variables

Key backend environment variables (`backend/.env`):
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`: Cryptographic keys
- `AI_SERVICE_URL`: FastAPI base URL. For the deployed AI service use `https://3.109.59.137`; locally use `http://localhost:8000`. The backend appends `/api/v1/predict` when forwarding image uploads.
- `LLM_PROVIDER`: `gemini` (default) or `openai`
- `GEMINI_API_KEY`: Google AI Studio API key
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: SMTP credentials used to send account verification emails
- `SMTP_SECURE`: Set to `true` for implicit TLS (commonly port 465); port 587 uses STARTTLS
- `EMAIL_FROM`: Optional sender name/address; defaults to `SMTP_USER`
- `FRONTEND_URL`: Public frontend origin used to construct verification links

New signups receive a verification email that expires after 24 hours. Configure SMTP before enabling production registration; unverified accounts cannot sign in. In `development` only, if SMTP is unavailable, the signup response contains a one-time verification token and the frontend completes verification locally. Existing accounts are treated as verified for compatibility.

---

## 📄 License
MIT License. Created for educational and clinical research assistance. Always consult a certified dermatologist for professional diagnosis.
