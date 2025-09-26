# Estágio de build
FROM node:18-alpine as build

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar o código fonte
COPY . .

# Construir a aplicação
RUN npm run build

# Estágio de produção
FROM nginx:alpine

# Copiar configuração personalizada do Nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copiar arquivos de build do estágio anterior
COPY --from=build /app/build /usr/share/nginx/html

# Expor porta 80
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
