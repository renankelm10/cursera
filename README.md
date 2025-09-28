# cursera

plataforma completa para cursos online, com áreas separadas para alunos e administradores. O projeto é dividido em duas partes principais:

Frontend: A parte visual do site, onde os usuários interagem. Feita em React, ela inclui:

Dashboard principal: Para listar e filtrar os cursos disponíveis.

Página de Cursos: Para assistir às aulas em vídeo e ver o conteúdo.

Perfil de Usuário: Onde cada aluno pode ver seu progresso e editar suas informações.

Painel Administrativo: Uma área restrita para gerenciar todos os aspectos da plataforma, como cursos, aulas, usuários e banners.

Backend: O "cérebro" da aplicação, que lida com os dados e a lógica. Feito em Node.js com Express, ele é responsável por:

Gerenciar o banco de dados usando o Supabase.

Controlar o registro e login de usuários, com diferenciação entre administradores e usuários comuns.

Fornecer uma API para que o frontend possa criar, ler, atualizar e deletar informações sobre cursos, aulas e outros dados.

Todo o sistema é preparado para ser facilmente implantado usando Docker, o que significa que tanto o frontend quanto o backend podem ser "empacotados" e executados em qualquer servidor de forma simples e consistente.
