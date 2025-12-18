# 🍺 Maltada

> **O seu guia definitivo no universo cervejeiro. Avalie, descubra e compartilhe.**

## 🔗 Acesso ao Projeto

O projeto está online! Você pode acessá-lo diretamente através do link abaixo:

[**🚀 Clique aqui para acessar o Maltada**](https://ecos-project-bd0c9.web.app/)

---

## 📖 Sobre o Projeto

O **Maltada** é uma plataforma desenvolvida para amantes de cerveja, combinando funcionalidades de redes sociais de nicho (como Untappd) com sistemas de avaliação detalhados.

O objetivo é permitir que usuários cataloguem as suas experiências etílicas, filtrem cervejas baseadas em custo-benefício e acompanhem notícias do mundo cervejeiro através de um blog comunitário.

---

## 🚀 Funcionalidades Principais

### 📝 Blog & Notícias (Home)
* **Feed de Notícias:** Página inicial com artigos e novidades.
* **Interação:** Sistema completo de comentários nas postagens.
* **Autoria:** Identificação visual do autor (Avatar e Nome) em cada post e comentário.
* **CRUD Completo:** Usuários podem criar, editar e excluir as suas próprias postagens com upload de imagens de capa.

### 🍻 Avaliação de Cervejas
* **Catálogo:** Listagem de cervejas com filtros avançados.
* **Review Detalhado:** Avaliação por nota (0-5), comentários, preço pago e tipo de envase (lata, garrafa, chopp).
* **Filtros Inteligentes:** Busque cervejas pela nota média ou faixa de preço.

### 👤 Perfil de Usuário
* **Customização:** Edição de dados pessoais e upload de foto de perfil (Avatar).
* **Histórico:** Visualização e edição de todas as avaliações já realizadas pelo usuário.

---

## 🛠 Tech Stack

O projeto foi construído utilizando as seguintes tecnologias:

* **Frontend:** React.js
* **Linguagem:** JavaScript (ES6+)
* **Estilização:** Material UI (MUI) & SCSS
* **Roteamento:** React Router Dom
* **Backend as a Service (BaaS):** Supabase
    * Database (PostgreSQL)
    * Authentication (Auth)
    * Storage (Buckets para imagens)

---

## 🗄 Estrutura do Banco de Dados (Supabase)

O projeto utiliza as seguintes tabelas principais:

* `profiles`: Dados estendidos do usuário (nome, avatar). Ligado à tabela *auth.users*.
* `posts`: Artigos do blog (título, conteúdo, imagem, autor).
* `comments`: Comentários vinculados aos posts.
* `beers`: Catálogo de cervejas.
* `reviews`: Avaliações vinculadas a usuários e cervejas.

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

<p align="center">
  Desenvolvido com 🍻 por Carlos Vinícius Pereira
</p>
