# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Diabetic retinopathy detection system (thesis project). Full-stack web app that uses an ensemble of 5 deep learning models to classify fundus images into 5 severity levels: none, mild, moderate, severe, proliferative. Built with React + FastAPI + MongoDB, deployed on Railway via Docker.

## Commands

### Frontend (in `frontend/`)
```bash
cd frontend
yarn install          # install dependencies
yarn start            # dev server on http://localhost:3000 (uses craco)
yarn build            # production build → frontend/build/
yarn test             # run tests (jest via craco)
```

### Backend (in `backend/`)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000   # start server
```

### Docker (production)
```bash
docker build -t retinopatia-app .
docker run -p 8000:8000 retinopatia-app
```

### Linting/Formatting (backend)
```bash
black backend/        # format
isort backend/        # sort imports
flake8 backend/       # lint
```

## Architecture

### Monorepo with two main directories

- **`backend/`** — FastAPI (Python). Entry point: `backend/app/main.py`
- **`frontend/`** — React 19 SPA with Tailwind CSS + Shadcn/UI. Entry point: `frontend/src/App.js`

In production, the compiled React app is served by FastAPI from `/app/public/` with an SPA fallback route. Both API and frontend are served from a single container on port 8000.

### Backend structure (`backend/app/`)

- `core/config.py` — Settings via pydantic-settings (env vars: `MONGODB_URI`, `JWT_SECRET_KEY`, `ALLOWED_ORIGINS`)
- `core/database.py` — Async MongoDB connection (Motor driver)
- `core/security.py` — JWT generation/validation, bcrypt password hashing
- `routes/auth.py` — Login/register endpoints (`/api/auth/...`)
- `routes/pages.py` — CMS content endpoints (`/api/pages/:slug`)
- `routes/prediction.py` — Image analysis endpoint (`/api/predict/`)
- `services/model_service.py` — AI model loading, inference, and ensemble logic (the core ML code)

### AI Models (5-model ensemble)

All model weights live in `backend/models_weights/` tracked by Git LFS (`.pth` and `.pt` files). The `model_service.py` defines custom PyTorch architectures with External Attention modules for three models:

| Model | Architecture | Weight file |
|-------|-------------|-------------|
| DenseNet121+EA | Custom head with external attention | `densenet121_ea/best_model.pth` |
| EfficientNet-B0+EA | Custom head with external attention | `efficientnet_b0_ea/best_model.pth` |
| ResNet50+EA | Custom head with external attention | `resnet50_ea/best_model.pth` |
| ViT-B/16 | Vision Transformer | `vit_b16/vit_b16_best.pt` |
| YOLOv8x-cls | Ultralytics classification | `yolov8x_cls/best.pt` |

Ensemble strategy: all 5 models predict, consensus vote determines severity, average confidence from agreeing models.

### Frontend structure (`frontend/src/`)

- `App.js` — Routing setup. Exports `BACKEND_URL` and `API_URL` constants.
- `pages/` — Page-level components: `Inicio.jsx`, `Modelo.jsx`, `Proceso.jsx`, `admin/Login.jsx`, `admin/Dashboard.jsx`, `admin/PageEditor.jsx`
- `components/ui/` — Shadcn/UI components (Radix-based)
- `components/layout/` — `Header.jsx`, `Footer.jsx`, `Layout.jsx`
- `components/sections/` — Reusable content sections (`Hero.jsx`, `ContentSection.jsx`)
- `services/api.js` — Axios API client

### API Routes

- `POST /api/auth/login` — Admin authentication (returns JWT)
- `POST /api/auth/register` — User registration
- `GET/PUT /api/pages/:slug` — CMS page content (slugs: inicio, modelo, proceso)
- `POST /api/predict/` — Upload fundus image, returns ensemble prediction
- `GET /health` — Health check
- `GET /docs` — Auto-generated FastAPI docs

### Database

MongoDB (async via Motor). Database name: `retinopatia_db`. Collections: `users`, `pages`. Init script: `backend/init_db.py`.

## Key Conventions

- Project language is **Spanish** (UI text, code comments, variable names in some places). Keep this consistent.
- Frontend uses `.jsx` extension for components.
- Backend API routes are all under `/api` prefix.
- Environment config: backend reads from `backend/.env`, frontend from `frontend/.env` (`REACT_APP_BACKEND_URL`).
- Frontend build tool is **Craco** (wraps CRA), configured in `frontend/craco.config.js`.
- The `public/` directory at project root holds the pre-compiled frontend for Docker deployment (not the frontend source).
- Model weights are large files tracked with **Git LFS** — see `.gitattributes`.

## Deployment

- Platform: **Railway.app** (auto-deploys from git)
- Config: `railway.json` (Dockerfile builder)
- Single Docker container serves both frontend and backend
- Health check: `GET /health` (120s start period for model loading)
- Production URL pattern: `https://tesis-retinopatia.up.railway.app`
