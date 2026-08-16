# 🚀 AWS Deployment Guide - Fast Track

## Prerequisites
- AWS Account
- AWS CLI installed
- Docker installed locally

---

## **Step 1: Create ECR Repository**

```powershell
# Set variables
$AWS_REGION = "us-east-1"  # Change if needed
$AWS_ACCOUNT_ID = "YOUR_ACCOUNT_ID"  # Get from AWS Console
$REPO_NAME = "skindegies-ai-model"

# Create ECR repo
aws ecr create-repository `
  --repository-name $REPO_NAME `
  --region $AWS_REGION
```

---

## **Step 2: Build & Push Docker Image**

```powershell
# Login to ECR
aws ecr get-login-password --region $AWS_REGION | `
  docker login --username AWS --password-stdin `
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Navigate to ai-model folder
cd ai-model

# Build image
docker build -t $REPO_NAME:latest .

# Tag for ECR
docker tag ${REPO_NAME}:latest `
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${REPO_NAME}:latest

# Push to ECR
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${REPO_NAME}:latest
```

---

## **Step 3: Launch EC2 Instance**

Via AWS Console:
1. **EC2 → Instances → Launch Instance**
2. **AMI**: Ubuntu 22.04 LTS
3. **Instance Type**: `t3.medium` ($0.042/hour)
4. **Storage**: 30GB
5. **Security Group**: Allow ports 22 (SSH) & 8000 (API)
6. **Launch** ✅

---

## **Step 4: SSH Into Instance & Run Container**

```powershell
# SSH into instance (replace KEY.pem and IP)
ssh -i "KEY.pem" ubuntu@YOUR_EC2_PUBLIC_IP

# On EC2 instance:
sudo apt update && sudo apt install docker.io -y
sudo usermod -aG docker ubuntu
newgrp docker

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Run container
docker run -d \
  -p 8000:8000 \
  --name skindegies-api \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/skindegies-ai-model:latest
```

---

## **Step 5: Test API**

```powershell
# From your local machine
curl http://YOUR_EC2_PUBLIC_IP:8000/api/v1/health
```

---

## **Total Cost (Monthly)**
- **EC2 t3.medium**: ~$30
- **ECR storage**: ~$1-5 (depends on image size)
- **Data transfer**: ~$0-2
- **Total**: ~$35-37/month

---

## **Option: Use ECS Fargate (More Automated)**

If you want auto-scaling and better management:

1. Skip EC2, use **ECS Fargate** instead
2. Create task definition pointing to ECR image
3. Create service with load balancer
4. Auto-scales based on CPU/memory

**Cost**: Similar (~$35-50/month depending on compute)

---

## **Quick Troubleshooting**

| Issue | Solution |
|-------|----------|
| Image fails to build | Check Docker Desktop is running |
| Can't push to ECR | Run `aws ecr get-login-password...` |
| API not responding | Check security group allows port 8000 |
| Container crashes | `docker logs skindegies-api` |

