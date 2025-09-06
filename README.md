# 📘 Study Group Platform

A **full-stack application** designed to manage collaborative study sessions.  
The repository is divided into two main parts:

---

## 📂 Repository Structure
```
.
├── client/   # Frontend (React + TypeScript + Vite)
├── server/   # Backend (Node.js / Express or NestJS, depending on your setup)
└── README.md # Project introduction
```

---

## 🖥 Client
Located in [`client/`](./client)  

- Built with **React, TypeScript, Vite**  
- Styled with **Tailwind CSS**  
- Uses **Context API** for data & language management  
- Provides features for:
  - Topic & session management  
  - User management  
  - Interactions (questions, insights, feedback, etc.)  
- Comes with **Dockerfile + Nginx** for deployment  

👉 See [Client README](./client/README.md) for details.

---

## ⚙️ Server
Located in [`server/`](./server)  

- Provides the **API backend** for the client app  
- Manages persistent data storage (Users, Topics, Sessions, Interactions)  
- Exposes REST endpoints (e.g., `/users`, `/topics`, `/sessions`)  
- Can be swapped between **MockDataService** (client-side mock) and **ApiDataService** (real backend)  

👉 See [Server README](./server/README.md) for setup and API documentation.

---

## 🚀 Getting Started

### Clone the repository
```bash
git clone <repo-url>
cd study-group-platform
```

### Start Client
```bash
cd client
npm install
npm run dev
```

### Start Server
```bash
cd server
npm install
npm run dev
```

---

## 🐳 Docker Deployment
Both **client** and **server** come with Docker support. You can build and run each individually, or set up a `docker-compose.yml` to orchestrate them together.  

---
