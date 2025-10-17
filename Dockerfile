# Dockerfile para CODserver Super App
FROM node:18-alpine

# Instalar dependências do sistema
RUN apk add --no-cache git python3 make g++

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY client/package*.json ./client/

# Instalar dependências
RUN npm install
RUN cd client && npm install

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Expor porta
EXPOSE 3001

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S codserver -u 1001

# Mudar propriedade dos arquivos
RUN chown -R codserver:nodejs /app
USER codserver

# Comando de inicialização
CMD ["npm", "start"]
