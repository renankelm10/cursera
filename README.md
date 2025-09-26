# cursera

Este repositório contém o frontend e o backend da plataforma de cursos Cursera.

## 🐳 Dockerização Completa (Frontend e Backend)

Para facilitar a implantação completa da aplicação (frontend e backend) em ambientes de produção, como uma VPS, foram adicionados arquivos de Dockerização.

### Pré-requisitos

Certifique-se de ter o Docker e o Docker Compose instalados em seu servidor.

### Estrutura do Projeto

```
cursera/
├── backend/                # Código fonte do backend Node.js
│   ├── Dockerfile          # Dockerfile para o backend
│   ├── ...
├── frontend/               # Código fonte do frontend React
│   ├── Dockerfile          # Dockerfile para o frontend
│   ├── nginx/              # Configuração do Nginx para o frontend
│   ├── ...
├── .env.example            # Exemplo de variáveis de ambiente
├── docker-compose.yml      # Orquestração Docker para frontend e backend
└── README.md
```

### Configuração

1.  **Variáveis de Ambiente:** Crie um arquivo `.env` na raiz do projeto (o mesmo nível do `docker-compose.yml`) com as variáveis de ambiente necessárias. Você pode usar o `.env.example` como base:

    ```env
    SUPABASE_URL=sua_url_do_supabase
    SUPABASE_ANON_KEY=sua_chave_anon_aqui
    JWT_SECRET=seu_jwt_secret_muito_seguro
    FRONTEND_URL=http://localhost:7436
    ```

    **Importante:** Substitua os valores pelos seus dados reais do Supabase e uma chave JWT secreta forte. Para `FRONTEND_URL`, use o domínio onde seu frontend será acessível (ex: `http://localhost:7436` para acesso local ou `https://seusite.com` em produção).

2.  **Inicializar Banco de Dados:** Antes de subir os containers, execute o script SQL em `backend/database/init.sql` no seu painel do Supabase para criar as tabelas necessárias.

### Como Subir a Aplicação

Navegue até a raiz do projeto (onde o `docker-compose.yml` está localizado) e execute o seguinte comando:

```bash
docker compose up -d --build
```

*   `docker compose up -d`: Inicia os serviços definidos no `docker-compose.yml` em modo detached (segundo plano).
*   `--build`: Reconstrói as imagens dos serviços, garantindo que as últimas alterações no código sejam incluídas.

*   O **frontend** estará acessível na porta `7436`.
*   O **backend** estará acessível internamente pelo frontend através do nome do serviço `backend` e externamente na porta `2378`.

### Verificando o Status

Você pode verificar o status dos containers com:

```bash
docker compose ps
```

E os logs de um serviço específico (ex: backend) com:

```bash
docker compose logs backend
```

### Parando a Aplicação

Para parar e remover os containers, redes e volumes criados pelo Docker Compose:

```bash
docker compose down
```

