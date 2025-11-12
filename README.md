# Portal do Professor - Sistema Acadêmico

Este projeto é uma aplicação frontend em React que simula o Portal do Professor, um sistema acadêmico voltado para o gerenciamento de alunos, turmas e avaliações.

## Funcionalidades Principais

* **Autenticação:** Fluxo de login seguro com JWT.
* **Rotas Protegidas:** Acesso restrito às áreas do portal.
* **Dashboard:** Visão geral com métricas principais.
* **Gerenciamento de Alunos:** CRUD completo com busca e filtros.
* **Gerenciamento de Turmas:** CRUD e associação de alunos.
* **Configuração de Avaliações:** Sistema dinâmico de pesos e critérios.

## Tecnologias Utilizadas

* **React (v18+)**
* **Vite:** Build tool de alta performance.
* **TypeScript:** Para tipagem estática e escalabilidade.
* **React Router (v6):** Para roteamento.
* **MUI (Material-UI):** Biblioteca de componentes (Material Design).
* **Axios:** Para requisições HTTP.
* **Context API:** Para gerenciamento de estado global (Autenticação).

## Instalação e Execução

Siga os passos abaixo para configurar e executar o projeto localmente.

1.  **Clone o repositório:**
    ```bash
    git clone [URL_DO_REPOSITORIO]
    cd sistema-academico/
    ```

2.  **Instale as dependências:**
    *(Certifique-se de ter o Node.js v18+ instalado)*
    ```bash
    npm install
    ```

3.  **Execute o servidor de desenvolvimento:**
    O Vite iniciará a aplicação em `http://localhost:5173`.
    ```bash
    npm run dev
    ```

## Scripts Disponíveis

* `npm run dev`: Inicia o servidor de desenvolvimento.
* `npm run build`: Compila o projeto para produção.
* `npm run lint`: Executa o linter (ESLint).
* `npm run preview`: Visualiza a build de produção localmente.