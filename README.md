# TasksApp

Projeto desafio técnico realizado para processo de vaga de estágio. 

## 🚀 Acesso ao Projeto

**[🔗 Clique aqui para acessar o projeto no Vercel](https://desafio-tecnico-skyline.vercel.app/)**

---

## ✨ Funcionalidades

* **Gestão de Notas e Tarefas:** Crie, visualize e edite notas de texto livre ou itens acionáveis.
* **Ações Otimistas (Optimistic UI):** A interface é atualizada instantaneamente ao interagir com os cards, enquanto o banco de dados sincroniza em segundo plano de forma invisível.
* **Fixar no Topo:** Destaque itens importantes fixando-os no topo da lista.
* **Conclusão de Tarefas:** Marque tarefas como concluídas ou pendentes, com separação visual automática.
* **Sistema de Lixeira:** Exclusão segura (Soft Delete) com a opção de restaurar itens, excluir permanentemente de forma individual ou esvaziar a lixeira inteira de uma vez.
* **Modo Claro/Escuro:** Alternância nativa de temas com persistência das preferências do usuário.
* **Design Responsivo:** Layout adaptável para dispositivos móveis, tablets e desktops, com uma Sidebar inteligente que se transforma em menu hambúrguer em telas menores.

---

## 🛠️ Tecnologias Utilizadas

* **[Next.js](https://nextjs.org/):** Framework React estruturado com App Router e Server Actions para comunicação direta e segura com o banco de dados.
* **[Tailwind CSS](https://tailwindcss.com/):** Estilização ágil baseada em classes utilitárias e variáveis de tema global configuradas via CSS.
* **[Framer Motion](https://www.framer.com/motion/):** Biblioteca de animações para transições suaves de rotas e reordenação fluida de layout nos cards.
* **[Prisma ORM](https://www.prisma.io/):** Modelagem de dados, tipagem estática e gerenciamento da comunicação com o banco.
* **[MongoDB](https://www.mongodb.com/):** Banco de dados NoSQL hospedado em nuvem (Atlas).
* **[Lucide React](https://lucide.dev/):** Pacote de ícones minimalistas.

---

## 📚 Documentação do Projeto

Abaixo você encontra os registros detalhados das decisões arquiteturais, planejamento e evolução do projeto:

* 📝 **[Respostas Técnicas](./docs/respostas-tecnicas.md):** Respostas dos componentes presentes na tarefa 2.
* 🗺️ **[Planejamento](./docs/prompts/planejamento.md):** Rascunho de ideias, definição da arquitetura (Fullstack Serverless), modelagem do banco de dados e requisitos.
* ⚙️ **[Configuração do DB](./docs/prompts/config-db.md):** Etapas de setup do MongoDB e resolução de desafios com a configuração do Prisma.
* 💻 **[Desenvolvimento](./docs/prompts/desenvolvimento.md):** Histórico da construção das interfaces, componentização (Cards, Sidebar, Topbar), roteamento e ajustes de UI/UX.
