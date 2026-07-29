# AI Image Library

A modern web application where users can upload, search, browse, and download images using semantic AI-generated metadata.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Python + FastAPI
- **Database**: PostgreSQL + pgvector
- **AI Pipelines**: CLIP, BLIP/Florence-2, YOLO

## Folder Structure
```text
ai-image-library/
├── frontend/             # React App (Vite, Tailwind, React Router)
│   ├── public/
│   └── src/
│       ├── assets/       # Media, images, static design elements
│       ├── components/   # Reusable UI controls and components
│       ├── context/      # Context providers (Auth, theme, etc.)
│       ├── hooks/        # Custom react hooks
│       ├── pages/        # Route page views (Dashboard, Search, Login...)
│       ├── services/     # API request services (Axios client)
│       ├── App.jsx       # App layout and routes configuration
│       ├── index.css     # Global styles and design system variables
│       └── main.jsx      # Entry mount file
├── backend/              # FastAPI Application (Phase 2+)
├── database/             # PostgreSQL and pgvector schemas (Phase 2+)
└── README.md             # Project documentation
```

## Getting Started (Frontend Dev Setup)

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the application in your browser at `http://localhost:3000`.
