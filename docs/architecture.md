# SkinDegies AI — System Architecture

```
                               ┌─────────────────────────┐
                               │   React 18 + Vite       │
                               │   Tailwind CSS          │
                               │   (Deployed on Vercel)  │
                               └────────────┬────────────┘
                                            │ HTTP / REST
                                            ▼
                               ┌─────────────────────────┐
                               │   Node.js / Express     │
                               │   JWT / Helmet / Multer │
                               │   (Deployed on Render)  │
                               └──────┬────────────┬─────┘
                                      │            │
                           HTTP POST  │            │ HTTP POST
                     multipart/form   │            │ JSON Prompt
                                      ▼            ▼
         ┌──────────────────────────────┐  ┌──────────────────────────────┐
         │    FastAPI AI Microservice   │  │   LLM Service (Gemini API)   │
         │    PyTorch EfficientNetV2-S  │  │   (Gemini 2.5 Flash /        │
         │    (Deployed on Railway)     │  │    OpenAI GPT-4o Fallback)   │
         └──────────────────────────────┘  └──────────────────────────────┘
                                                   │
                                                   ▼
                                       ┌─────────────────────────┐
                                       │     MongoDB Atlas       │
                                       │ Users, Predictions,     │
                                       │ Reports, Feedback       │
                                       └─────────────────────────┘
```

## Microservices Breakdown

1. **Frontend**: React 18 SPA compiled with Vite. Provides dark medical glassmorphism theme, Framer Motion animations, interactive questionnaires, Recharts confidence breakdown, and printable report output.
2. **Backend**: Express REST API handling JWT authentication, rate limiting, Mongoose ORM models, Multer image upload buffering, and proxying requests to the AI microservice and Gemini API.
3. **AI Service**: FastAPI microservice hosting the fine-tuned EfficientNetV2-S model in PyTorch. Preprocesses input tensors to 384x384 ImageNet resolution and outputs top-3 class predictions.
4. **LLM Integration**: Provider-agnostic service layer that converts top-3 predictions and clinical questionnaire answers into a structured JSON medical report using Gemini 2.5 Flash (or OpenAI GPT-4o).
5. **Database**: MongoDB Atlas hosting indexed collections for `Users`, `Predictions`, `Reports`, `Feedback`, and `Contact` submissions.
