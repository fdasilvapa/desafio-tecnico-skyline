
# Prompts de planejamento do projeto

## Prompt 1: Definição de arquitetura

> Foi anexado um txt com um resumo do desafio no prompt
```
Preciso de ajuda numa decisão aqui, tenho esse desafio técnico a ser desenvolvido, estou com duas vertentes principais, como disseram que deploy é opcional:
Cenário 1: Frontend puro, dados salvos no local storage, deploy com vercel
Cenário 2: Front, back, bd, tudo orquestrado com docker, porém sem deploy
o que me diz? tenho 4 dias acho que o prazo é tranquilo para ambos os cenários
```
A partir desse prompt o agente me deu uma terceira opção que era o meio termo entre os dois cenários: Fullstack serverless com deploy no vercel

### Trecho da resposta:
Use o Next.js para a interface (com Tailwind e Framer Motion).
Use as API Routes ou Server Actions do Next.js para o backend.
Em vez de subir um banco local com Docker, conecte sua aplicação a um banco de dados em nuvem gratuito (como Supabase, MongoDB Atlas ou Firebase). Isso atende ao uso de um "banco de dados real".
Faça o deploy na Vercel (que tem integração nativa e zero dor de cabeça com Next.js).

### Tomada de decisão:
Achei interessante a proposta e decidi seguir com ela usando MongoDB, já que já possuo conta registrada.

## Prompt 2: Definição do banco de dados

Essa abordagem vai ser interessante, já tenho conta no MongoDB, vamos usar ele.
Como é um banco não relacional, acho que podemos simplificar o que vamos gravar nele, pensei numa estrutura parecida com isso para os cards:
id - (pode ser gerado via timestamp)
title - título do card
description - descrição (opcional)
is_active - booleano (pensei em usar isso para um sistema de lixeira, só preciso definir se seria mais performático gravar isso no back, ou diretamente no front)
O que acha?

### Trecho da resposta:
- id: Em vez de gerar um timestamp manualmente, deixe o próprio MongoDB cuidar disso usando o campo padrão _id (ObjectId). Ele é altamente otimizado para buscas, já possui o timestamp de criação embutido em seu hash e elimina qualquer risco de IDs duplicados.
- title e description: Perfeitos, diretos ao ponto.
- is_active: Excelente para o envio à lixeira.

**Adições Estratégicas:** Como a tarefa exige organizar "notas e tarefas", sugiro incluir:
- type: Uma string (ex: 'note' ou 'task') para diferenciar se o card é um texto livre ou um item acionável.
- is_completed: Um booleano (útil para os cards do tipo 'task') para marcar se a tarefa foi finalizada.
- color (opcional): Uma string em HEX. Já que o uso de Tailwind é exigido , permitir que o usuário mude a cor do card vai dar aquela "cara de Google Keep" muito bem-vinda.
- createdAt / updatedAt: Essenciais para ordenar os cards na interface (ex: exibir os mais recentes no topo). O Mongoose ou o Prisma geram isso automaticamente.

### Tomada de decisão:
Já estava pensando em usar o prisma, então segui com a sugestão dele. Só não acatei o color por enquanto, para dar uma enxugada no escopo, mas caso sobre tempo é possível implementar.
O modelo ficou assim:
```
model Card {
  id           String   @id @default(cuid())
  title        String
  description  String?
  is_active    Boolean  @default(true)
  is_completed Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```
## Prompt 3: Requisitos

Preciso levantar os requisitos do sistema para começar a desenvolver a interface, separei algumas referências num projeto do figma (como google keep e google tasks) para ter uma base e rascunhar a tela principal.
Sobre essa estrutura de interface:
Sidebar do lado esquerdo (pode ser minimizada ou expandida, já pensando na responsividade) com opções principais como:
-Tarefas
-Notas
-Tema (claro/escuro)
-Lixeira
Área de trabalho principal ao lado direito:
-ocupa 70-80% da tela
-é onde ficam os cards criados pelo usuário
Topbar:
-Botão de controle da sidebar
-Logo
Após implemetar vou realizar alguns testes, então o rascunho base pode passar por mudanças.
Para os requisitos, quero que contenha as funções mínimas de:
-Criar card (nota/tarefa) - cada um deles tem uma tela no workspace, definida clicando na sidebar, visto que serão renderizados via componentes que terão estilos ligeiramente diferentes
-Editar card
-Apagar card (Somente após criação - soft delete com o is_active no banco, caso is_active = false, o item deve ser renderizado na lixeira)
-Concluir tarefa
-Botão de troca de tema (claro/escuro)

Acha que mais alguma coisa deve ser adicionada? Vamos prosseguir para a criação desses requisitos

### Definição final de requisitos:

Funcionais:

-Sidebar: Navegação entre "Notas", "Tarefas" e "Lixeira", controle de Tema (Dark/Light).

-Notas: Criar, visualizar, editar e enviar para a lixeira.

-Tarefas: Criar, visualizar, editar, marcar como concluída/pendente e enviar para a lixeira.

-Lixeira: Visualizar itens deletados, restaurar itens, esvaziar lixeira (Hard Delete).

Não Funcionais / Técnicos:

-Construído com React, Next.js (App Router), Node (Server Actions) e Prisma ORM (MongoDB).

-Estilização com Tailwind CSS.

-Animações de interações e layout com Framer Motion.

-Responsividade: Layout adaptável para telas menores (Sidebar vira menu hambúrguer).

Diferenciais (se o tempo permitir):

Sistema de fixar