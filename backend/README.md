# Cursera Backend API

Backend completo para a plataforma de cursos Cursera, desenvolvido em Node.js com Express e integrado ao Supabase.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Supabase** - Backend-as-a-Service (PostgreSQL)
- **JWT** - Autenticação via tokens
- **bcryptjs** - Hash de senhas
- **Helmet** - Segurança HTTP
- **Morgan** - Logging de requisições
- **CORS** - Cross-Origin Resource Sharing

## 📋 Funcionalidades

### Autenticação
- ✅ Registro de usuários
- ✅ Login com JWT
- ✅ Middleware de autenticação
- ✅ Controle de acesso por roles (admin/user)

### Cursos
- ✅ Listagem de cursos
- ✅ Detalhes do curso com aulas
- ✅ CRUD completo (admin)
- ✅ Sistema de matrícula

### Aulas
- ✅ Listagem por curso
- ✅ CRUD completo (admin)
- ✅ Sistema de progresso do usuário

### Configurações da Plataforma
- ✅ Configurações globais
- ✅ Personalização da interface

### Banners
- ✅ Sistema de banners para homepage
- ✅ CRUD completo (admin)

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais
- `users` - Usuários da plataforma
- `courses` - Cursos disponíveis
- `lessons` - Aulas dos cursos
- `platform_config` - Configurações da plataforma
- `banner_images` - Banners da homepage
- `enrollments` - Matrículas dos usuários
- `user_progress` - Progresso nas aulas

## 🛠️ Instalação e Configuração

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
PORT=3001
JWT_SECRET=seu_jwt_secret_muito_seguro
FRONTEND_URL=http://localhost:3000
```

### 3. Inicializar Banco de Dados
Execute o script SQL em `database/init.sql` no seu painel do Supabase para criar as tabelas necessárias.

### 4. Executar o Servidor

#### Desenvolvimento
```bash
npm run dev
```

#### Produção
```bash
npm start
```

O servidor estará disponível em `http://localhost:3001`

## 📚 Endpoints da API

### Autenticação (`/api/auth`)
- `POST /register` - Registrar novo usuário
- `POST /login` - Fazer login
- `GET /profile` - Obter perfil do usuário (protegido)

### Cursos (`/api/courses`)
- `GET /` - Listar todos os cursos
- `GET /:id` - Obter detalhes do curso
- `POST /` - Criar curso (admin)
- `PUT /:id` - Atualizar curso (admin)
- `DELETE /:id` - Deletar curso (admin)
- `POST /:courseId/enroll` - Matricular-se no curso (protegido)

### Aulas (`/api/lessons`)
- `GET /course/:courseId` - Listar aulas do curso
- `GET /:id` - Obter detalhes da aula
- `POST /` - Criar aula (admin)
- `PUT /:id` - Atualizar aula (admin)
- `DELETE /:id` - Deletar aula (admin)
- `POST /:id/complete` - Marcar aula como completa (protegido)

### Configurações (`/api/config`)
- `GET /` - Obter configurações da plataforma
- `PUT /` - Atualizar configurações (admin)

### Banners (`/api/banners`)
- `GET /` - Listar banners ativos
- `GET /:id` - Obter detalhes do banner
- `GET /admin/all` - Listar todos os banners (admin)
- `POST /` - Criar banner (admin)
- `PUT /:id` - Atualizar banner (admin)
- `DELETE /:id` - Deletar banner (admin)

### Health Check
- `GET /api/health` - Verificar status da API

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Para acessar rotas protegidas, inclua o token no header:

```
Authorization: Bearer seu_jwt_token_aqui
```

## 👥 Roles de Usuário

- **User**: Usuário comum (pode se matricular em cursos, marcar aulas como completas)
- **Admin**: Administrador (acesso total ao CRUD de cursos, aulas, banners e configurações)

## 🚦 Status Codes

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Requisição inválida
- `401` - Não autorizado
- `403` - Acesso negado
- `404` - Não encontrado
- `500` - Erro interno do servidor

## 📝 Exemplo de Uso

### Registrar Usuário
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "password": "senha123"
  }'
```

### Fazer Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "password": "senha123"
  }'
```

### Listar Cursos
```bash
curl -X GET http://localhost:3001/api/courses
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ pela equipe Cursera**
