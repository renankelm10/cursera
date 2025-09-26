# curser-


## 🐳 Dockerização do Backend

Para facilitar a implantação do backend em ambientes de produção, como uma VPS, foram adicionados arquivos de Dockerização.

### Pré-requisitos

Certifique-se de ter o Docker e o Docker Compose instalados em seu servidor.

### Configuração

1.  **Variáveis de Ambiente:** Crie um arquivo `.env` na raiz do projeto (o mesmo nível do `docker-compose.yml`) com as variáveis de ambiente necessárias. Você pode usar o `.env.example` como base:

    ```env
    SUPABASE_URL=sua_url_do_supabase
    SUPABASE_ANON_KEY=sua_chave_anon_aqui
    JWT_SECRET=seu_jwt_secret_muito_seguro
    FRONTEND_URL=http://localhost:3000
    ```

    **Importante:** Substitua os valores pelos seus dados reais do Supabase e uma chave JWT secreta forte.

2.  **Inicializar Banco de Dados:** Antes de subir o container, execute o script SQL em `backend/database/init.sql` no seu painel do Supabase para criar as tabelas necessárias.

### Como Subir a Aplicação

Navegue até a raiz do projeto (onde o `docker-compose.yml` está localizado) e execute o seguinte comando:

```bash
docker compose up -d --build
```

*   `docker compose up -d`: Inicia os serviços definidos no `docker-compose.yml` em modo detached (segundo plano).
*   `--build`: Reconstrói as imagens dos serviços, garantindo que as últimas alterações no código sejam incluídas.

O backend estará acessível na porta `3001` do seu servidor.

### Verificando o Status

Você pode verificar o status dos containers com:

```bash
docker compose ps
```

E os logs do backend com:

```bash
docker compose logs backend
```

### Parando a Aplicação

Para parar e remover os containers, redes e volumes criados pelo Docker Compose:

```bash
docker compose down
```

