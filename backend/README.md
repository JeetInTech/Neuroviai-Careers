# CV Forge Backend

FastAPI backend for CV Forge - AI-Powered Resume Builder

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Edit `.env` file with your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
FRONTEND_URL=http://localhost:5173
```

**Important:** Get your Service Role Key from Supabase Dashboard:
1. Go to Project Settings → API
2. Copy the `service_role` key (NOT the `anon` key)

### 4. Run the Server

```bash
python run.py
```

Or with uvicorn directly:

```bash
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new account
- `POST /auth/signin` - Sign in with email/username
- `POST /auth/signout` - Sign out
- `POST /auth/reset-password` - Request password reset
- `POST /auth/refresh` - Refresh access token

### Profile
- `GET /profile/me` - Get current user profile
- `PUT /profile/me` - Update current user profile
- `GET /profile/{username}` - Get public profile

### CV Management
- `POST /cv/create` - Create new CV
- `GET /cv/list` - List user's CVs
- `GET /cv/{cv_id}` - Get CV details
- `PUT /cv/{cv_id}` - Update CV
- `DELETE /cv/{cv_id}` - Delete CV
- `POST /cv/{cv_id}/publish` - Make CV public
- `POST /cv/{cv_id}/unpublish` - Make CV private

### ATS Analysis
- `POST /ats/analyze` - Analyze CV for ATS optimization
- `POST /ats/{cv_id}/analyze` - Analyze saved CV

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
