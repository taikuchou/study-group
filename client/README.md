# 📘 Study Group Platform Client

A **React + TypeScript + Vite** project scaffolded for building a modern, fast, and scalable **study group management platform**.  

This project uses **Tailwind CSS** for styling and comes with **Docker + Nginx** support for production deployment.  

---

## 🚀 Features
- ⚡ **Vite** for blazing fast builds & HMR  
- ⚛️ **React 18 + TypeScript**  
- 🎨 **Tailwind CSS** for styling  
- 🖼 **Lucide React** for icons  
- 🐳 **Dockerfile** + `nginx.conf` for container deployment  
- 🌍 **i18n support** with `LanguageContext`  
- 🔧 **Mock API + real API service layer** via `DataContext`  

---

## 📂 Project Structure
```
client/
│── dist/                  # Production build output
│── public/                # Static assets
│── src/                   # React source code
│   ├── app/               # Main app entry (StudyGroupPlatform.tsx)
│   ├── components/        # Shared UI components
│   ├── features/          # Domain-driven features (topics, sessions, users, interactions)
│   ├── context/           # Global providers (DataContext, LanguageContext)
│   ├── services/          # ApiDataService & MockDataService
│   ├── data/              # Mock data for development
│   ├── types/             # TypeScript interfaces for User, Topic, Session, etc.
│   └── index.tsx          # App entry point
│── Dockerfile             # Container build instructions
│── nginx.conf             # Nginx configuration
│── package.json           # Project metadata and dependencies
│── vite.config.ts         # Vite build config
│── tailwind.config.ts     # Tailwind CSS config
│── tsconfig.json          # TypeScript configuration
│── .env.local             # Local environment variables
```

---

## 🛠 React Components & Routes

### Main App Entry
- `index.tsx` → mounts `<App />`.  
- `App.tsx` → wraps the app with `LanguageProvider` and `DataProvider`.  
- `StudyGroupPlatform.tsx` → central UI managing tabs: **Topics, Sessions, Users**.  

### Features
- **Topics (`src/features/topics`)**
  - `TopicList` → shows all study topics, expand/collapse, search, CRUD.
  - `TopicForm` → form for adding/editing topics.
- **Sessions (`src/features/sessions`)**
  - `SessionDetail` → session view (notes, references, questions, feedback).
  - `SessionForm` → create/edit sessions.
- **Users (`src/features/users`)**
  - `UserManagement` → manage participants (admin view).
  - `UserForm` → form for adding/editing users.
- **Interactions (`src/features/interactions`)**
  - `InteractionForm` → add questions, insights, speaker feedback, etc.

### Context Providers
- **DataContext** → manages all Users, Topics, Sessions, Interactions. Can switch between `ApiDataService` (real backend) or `MockDataService` (local mock data).  
- **LanguageContext** → provides i18n translations and language switching.  

### Services
- **ApiDataService** → fetches data from backend API (`VITE_API_URL`).  
- **MockDataService** → supplies mock data for local dev/testing.  

---

## ⚙️ Scripts
```bash
# Start dev server
npm run dev

# Build production
npm run build

# Preview production locally
npm run preview
```

---

## 🐳 Dockerfile & Deployment

### Dockerfile (simplified)
```dockerfile
# Step 1: Build stage
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Nginx stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Explanation
1. **Build Stage**:  
   - Uses Node.js image.  
   - Installs dependencies.  
   - Builds the app with Vite (`npm run build`).  

2. **Serve Stage**:  
   - Uses `nginx:alpine` (lightweight).  
   - Copies build output (`dist/`) to Nginx HTML folder.  
   - Uses custom `nginx.conf` to configure routing.  
   - Exposes port 80.  

### Run with Docker
```bash
# Build image
docker build -t study-group-client .

# Run container
docker run -p 8080:80 study-group-client
```

Then open 👉 `http://localhost:8080`

---

## 🔑 Environment Variables
In `.env.local`:
```env
VITE_API_URL=http://localhost:3000   # Backend API
VITE_DATA_SOURCE=mock                # or "api"
```

---

## 📦 Dependencies
- **Core**: `react`, `react-dom`, `lucide-react`  
- **Styling**: `tailwindcss`, `postcss`  
- **Dev**: `vite`, `typescript`  

---


