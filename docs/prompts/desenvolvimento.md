# Prompts de desenvolvimento

## Prompt 1: Criação do crud
> Resposta anterior do agente: Com esse mistério resolvido e a estrutura limpa, o terreno está perfeitamente preparado. Quer que eu escreva a estrutura das Server Actions (o nosso arquivo actions.ts) para finalmente criarmos e listarmos as notas/tarefas no banco?


Certo, vamos desenvolver o crud principal
---
Com isso criei o arquivo /actions/cardActions.ts, e parti para testar se os dados estavam sendo gravados corretamente. Para isso modificamos o arquivo app/page.tsx para funcionar como um formulário (ainda sem estilização) que dispara as ações de criação e listagem.
> **Nota:** Optei por criar o CRUD antes mesmo de fazer um levantamento dos requisitos, pois precisava validar se a conexão com o banco estava funcionando corretamente.

