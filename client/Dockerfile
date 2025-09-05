# ---- Build stage ----
FROM node:20-alpine AS build

# 安裝依賴用套件
RUN apk add --no-cache libc6-compat

WORKDIR /app

# 只先複製清單以利快取
COPY package*.json ./
# 如果你用 pnpm 或 yarn，請改用對應的 lock 檔與指令
RUN npm ci

# 複製其餘原始碼
COPY . .

# 確保 Vite 能看到環境變數（也可改用 .env.production 檔）
# ENV VITE_API_URL="https://api.example.com"
# ENV VITE_DATA_SOURCE="api"

# 產出 /dist
RUN npm run build

# ---- Runtime stage ----
FROM nginx:1.27-alpine AS runtime
WORKDIR /usr/share/nginx/html

# 拷貝前端靜態檔
COPY --from=build /app/dist ./

# 套用自訂 nginx 設定
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# 健康檢查（可選）
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget -qO- http://localhost/ || exit 1
