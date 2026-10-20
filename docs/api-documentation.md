# SkinDegies AI — API Documentation

## AI Microservice (FastAPI) — Port 8000

### 1. `POST /api/v1/predict`
Upload skin lesion image and receive top-3 disease predictions.

- **Content-Type**: `multipart/form-data`
- **Body**: `image` (File: JPEG, PNG, WebP, BMP up to 10MB)

#### Response (200 OK)
```json
{
  "top3": [
    { "disease": "Lichen", "confidence": 91.5, "rank": 1 },
    { "disease": "Psoriasis", "confidence": 5.2, "rank": 2 },
    { "disease": "Eczema", "confidence": 2.1, "rank": 3 }
  ],
  "model_version": "best_model.pth",
  "image_size": "384x384",
  "processing_time_ms": 42.7
}
```

### 2. `GET /api/v1/health`
Health probe for Railway / Docker container checks.

---

## Backend API (Express.js) — Port 5000

### Authentication Endpoints (`/api/v1/auth`)

- `POST /register`: Create a new user (`name`, `email`, `password`) and send a verification email (no JWT until verification)
- `POST /verify-email`: Verify an email using `{ token }`; the token expires after 24 hours
- `POST /resend-verification`: Request a fresh link using `{ email }`
- `POST /login`: Log in (`email`, `password`) → Returns JWT `accessToken` & `refreshToken`
- `POST /refresh-token`: Get a new access token using `refreshToken`
- `POST /forgot-password`: Request password reset email
- `POST /reset-password/:token`: Reset password using token
- `GET /me`: Get current authenticated user details

### Prediction Endpoints (`/api/v1/predictions`)

- `POST /predict` (Protected): Multipart upload `image` → Proxies to FastAPI AI microservice and saves prediction record.
- `POST /:id/report` (Protected): Accepts clinical questionnaire JSON and calls LLM (Gemini 2.5 Flash / OpenAI) to generate structured medical report.
- `GET /` (Protected): Get paginated prediction history for current user.
- `GET /:id` (Protected): Get prediction details with populated LLM report.
- `DELETE /:id` (Protected): Delete prediction and associated report.

### Admin Endpoints (`/api/v1/admin`)

- `GET /stats` (Admin Only): System metrics, total users, total predictions, disease statistics.
- `GET /users` (Admin Only): Searchable, paginated user list.
- `PATCH /users/:id/toggle-active` (Admin Only): Enable or disable user access.
- `DELETE /users/:id` (Admin Only): Cascade delete user and associated predictions/reports.
- `GET /predictions` (Admin Only): Audit log of all system predictions.
