# دیپلوی هوش‌یار — سازگار با Hugging Face Spaces، Render، Railway و هر VPS
FROM node:20-alpine

WORKDIR /app

# نصب وابستگی‌ها
COPY package*.json ./
RUN npm install --omit=dev

# کپی سورس
COPY . .

# پورت (Hugging Face Spaces روی 7860 کار می‌کند؛ Render خودش PORT را override می‌کند)
ENV PORT=7860
EXPOSE 7860

CMD ["node", "server.js"]
