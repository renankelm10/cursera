# Use a imagem oficial do Node.js como base
FROM node:18-alpine

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar o código da aplicação
COPY . .

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S cursera -u 1001

# Alterar propriedade dos arquivos para o usuário cursera
RUN chown -R cursera:nodejs /app
USER cursera

# Expor a porta que a aplicação usa
EXPOSE 3001

# Definir variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3001

# Comando para iniciar a aplicação
CMD ["npm", "start"]
