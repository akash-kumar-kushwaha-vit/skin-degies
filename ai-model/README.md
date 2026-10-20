# AI Service — SkinDegies

FastAPI microservice exposing the EfficientNetV2-S skin disease detection model.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/predict` | Upload image → top-3 predictions |
| `GET` | `/api/v1/health` | Service health check |
| `GET` | `/docs` | Swagger UI |
| `GET` | `/redoc` | ReDoc UI |

## Quick Start

```bash
# 1. Place your model checkpoint
cp /path/to/best_model.pth checkpoints/best_model.pth

# 2. Create .env
cp .env.example .env

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run locally
python main.py
# or
uvicorn main:app --reload --port 8000
```

## Build and run the AI-only Docker image

The image contains only this AI service and its model checkpoint; it does not
include the Node.js backend or frontend. Make sure
`ai-model/checkpoints/best_model.pth` is present before building. Checkpoints
are excluded from Git, so copy or download the model file into that folder on
the machine that builds the image.

This image installs CPU-only PyTorch for smaller deployments without a GPU.

Run these commands from the repository root:

```powershell
docker build -f ai-model\Dockerfile -t skindegies-ai:latest ai-model
docker run --rm -p 8000:8000 -e PORT=8000 skindegies-ai:latest
```

The build context is `ai-model`, so application files outside that folder are
not sent to Docker. The checkpoint is copied into the image, so it is not
necessary to mount it at runtime. To use a platform-assigned port, set
`PORT` in the container environment; it defaults to `8000`.

Check readiness at `http://localhost:8000/api/v1/health`. The service is ready
when the response has `"model_loaded": true`.

## Predict API

**Request** — `POST /api/v1/predict`
```bash
curl -X POST http://localhost:8000/api/v1/predict \
  -F "image=@skin_lesion.jpg"
```

**Response**
```json
{
  "top3": [
    { "disease": "Lichen",    "confidence": 91.5, "rank": 1 },
    { "disease": "Psoriasis", "confidence": 5.2,  "rank": 2 },
    { "disease": "Eczema",    "confidence": 2.1,  "rank": 3 }
  ],
  "model_version": "best_model.pth",
  "image_size": "384x384",
  "processing_time_ms": 42.7
}
```

## Model Replacement

To deploy a new model version:
1. Drop the new `best_model.pth` into `checkpoints/`
2. Restart the server (or redeploy on Railway)
3. No code changes required

## Environment Variables

See `.env.example` for all available settings.

| Variable | Default | Description |
|----------|---------|-------------|
| `MODEL_PATH` | `checkpoints/best_model.pth` | Path to checkpoint |
| `TOP_K` | `3` | Number of predictions to return |
| `ALLOWED_ORIGINS` | `*` | CORS allowed origins (comma-separated) |
| `LOG_LEVEL` | `INFO` | Logging verbosity |
| `ENVIRONMENT` | `production` | Environment tag |
