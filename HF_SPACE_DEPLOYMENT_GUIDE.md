# Deploy SkinDegies AI Model to Hugging Face Spaces (Paid Docker)

## Prerequisites
- Hugging Face account with **PRO plan** (for Docker Spaces)
- Git and Git LFS installed locally
- Your model checkpoint: `best_model.pth` (~243 MB)

---

## Step 1: Create a New Space on Hugging Face

1. Go to https://huggingface.co/spaces
2. Click **"Create new Space"**
3. Fill in the form:
   - **Space name**: `skindegies-ai-model` (or your choice)
   - **Space type**: Choose **Docker**
   - **Visibility**: Public or Private
4. Click **"Create Space"**

You'll be redirected to your new Space repo.

---

## Step 2: Prepare Your Local Files

Create a new folder for your HF Space deployment:

```bash
mkdir ~/skindegies-hf-space
cd ~/skindegies-hf-space
```

Copy the AI model folder structure:

```bash
# Copy from your main project
cp -r /path/to/skin\ degies/ai-model/* .

# The folder should now contain:
# ├── main.py
# ├── config.py
# ├── schemas.py
# ├── requirements.txt (use HF_SPACE_requirements.txt)
# ├── Dockerfile (use HF_SPACE_Dockerfile)
# ├── models/
# ├── routers/
# ├── services/
# ├── checkpoints/
# │   └── best_model.pth
# └── logs/
```

---

## Step 3: Set Up Git and Git LFS

```bash
cd ~/skindegies-hf-space

# Initialize git (if not already done)
git init

# Configure Git LFS for large files
git lfs install
git lfs track "*.pth"
git add .gitattributes

# Add your model checkpoint with LFS
git add checkpoints/best_model.pth
```

---

## Step 4: Use the HF-Optimized Dockerfile

Replace your `Dockerfile` with the one provided:

```bash
# Copy the HF-optimized Dockerfile
cp HF_SPACE_Dockerfile Dockerfile

# Copy the HF-optimized requirements.txt
cp HF_SPACE_requirements.txt requirements.txt
```

**Key differences from the original:**
- Port is set to `7860` (HF standard)
- Uses `${PORT:-7860}` environment variable
- Optimized for HF's compute constraints
- Includes health check pointing to `/api/v1/health`

---

## Step 5: Create README.md for Your Space

Create a `README.md` in the root:

```markdown
# SkinDegies AI Model API

FastAPI microservice for skin disease detection using EfficientNetV2-S.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/predict` | Upload image → top-3 predictions |
| `GET` | `/api/v1/health` | Service health check |
| `GET` | `/docs` | Swagger UI |
| `GET` | `/redoc` | ReDoc UI |

## Usage

### Predict Skin Disease

```bash
curl -X POST https://<your-hf-username>-skindegies-ai-model.hf.space/api/v1/predict \
  -F "image=@skin_lesion.jpg"
```

### Response

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

## Model Details

- **Architecture**: EfficientNetV2-S
- **Classes**: 22 skin disease types
- **Accuracy**: 81.56% top-1, 89.75% top-3
- **Input**: 384×384 RGB image
- **Memory**: ~4GB required for startup

## Supported Image Formats

- JPEG
- PNG
- WebP
- BMP

Max file size: 10 MB
```

---

## Step 6: Clone Your HF Space Repo

Get the clone URL from your HF Space settings. Then:

```bash
git clone https://huggingface.co/spaces/<your-username>/skindegies-ai-model ~/skindegies-hf-space-git
cd ~/skindegies-hf-space-git
```

Or if you already have the repo initialized:

```bash
git remote add origin https://huggingface.co/spaces/<your-username>/skindegies-ai-model
```

---

## Step 7: Push Your Files to HF Spaces

```bash
cd ~/skindegies-hf-space-git

# Add all files
git add .

# Commit
git commit -m "Deploy SkinDegies AI Model API v1.0"

# Push to HF Spaces (this triggers the Docker build)
git push origin main
```

---

## Step 8: Monitor the Build

After pushing, HF will automatically build your Docker image.

1. Go to your Space: `https://huggingface.co/spaces/<your-username>/skindegies-ai-model`
2. Click the **"Build"** section to see logs
3. Wait for the build to complete (typically 10-20 minutes depending on model size)
4. Once complete, the Space will be live at:
   ```
   https://<your-username>-skindegies-ai-model.hf.space
   ```

---

## Step 9: Test Your Deployed API

Once the Space is running, test the health endpoint:

```bash
curl https://<your-username>-skindegies-ai-model.hf.space/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "model_loaded": true,
  "device": "cpu"
}
```

Test prediction:

```bash
curl -X POST https://<your-username>-skindegies-ai-model.hf.space/api/v1/predict \
  -F "image=@test_image.jpg"
```

---

## Troubleshooting

### Build fails / times out
- Check the build logs in the Space settings
- Ensure `requirements.txt` is correct
- Verify the Docker image size is under 15GB

### Model doesn't load (container crashes)
- Your Space might not have enough RAM
- On paid plan, ensure you selected a larger compute option
- Check Space logs: Settings → Logs

### Port mismatch errors
- Ensure Dockerfile uses `PORT=${PORT:-7860}`
- Don't hardcode port to `8000` in HF Spaces

### Model file not found
- Verify `checkpoints/best_model.pth` exists in the repo
- Use Git LFS for files > 100MB:
  ```bash
  git lfs track "*.pth"
  git add .gitattributes
  git push
  ```

---

## File Checklist

Before pushing to HF Spaces, verify:

- ✅ `Dockerfile` (use the HF-optimized version)
- ✅ `requirements.txt` (use the HF-optimized version)
- ✅ `main.py`
- ✅ `config.py`
- ✅ `schemas.py`
- ✅ `models/efficientnet_model.py`
- ✅ `routers/predict.py`
- ✅ `services/model_service.py`
- ✅ `services/preprocess.py`
- ✅ `checkpoints/best_model.pth`
- ✅ `.gitattributes` (for Git LFS)
- ✅ `README.md` (Space documentation)

---

## Environment Variables (Optional)

Add these to your Space settings for fine-tuning:

| Variable | Default | Purpose |
|----------|---------|---------|
| `LOG_LEVEL` | `INFO` | Logging verbosity |
| `TOP_K` | `3` | Number of predictions to return |
| `ALLOWED_ORIGINS` | `*` | CORS allowed origins |
| `MODEL_PATH` | `checkpoints/best_model.pth` | Model checkpoint path |

To set environment variables:
1. Go to Space Settings
2. Scroll to "Repository secrets"
3. Add `LOG_LEVEL`, `TOP_K`, etc.

---

## Support

For issues:
1. Check HF Spaces documentation: https://huggingface.co/docs/hub/spaces
2. Check Docker build logs in your Space
3. Review model requirements: At least 4GB RAM, Python 3.11

---

## Next Steps

Once deployed:
- Share the Space link with your team
- Integrate the API into your frontend (`backend/`)
- Monitor Space usage in HF dashboard
