# Prompts de desenvolvimento

## Prompt 1: Criação do crud
> Resposta anterior do agente: Com esse mistério resolvido e a estrutura limpa, o terreno está perfeitamente preparado. Quer que eu escreva a estrutura das Server Actions (o nosso arquivo actions.ts) para finalmente criarmos e listarmos as notas/tarefas no banco?


Certo, vamos desenvolver o crud principal
---
Com isso criei o arquivo /actions/cardActions.ts, e parti para testar se os dados estavam sendo gravados corretamente. Para isso modificamos o arquivo app/page.tsx para funcionar como um formulário (ainda sem estilização) que dispara as ações de criação e listagem.
> **Nota:** Optei por criar o CRUD antes mesmo de fazer um levantamento dos requisitos, pois precisava validar se a conexão com o banco estava funcionando corretamente.

## Prompt 2: Criação do componente da sidebar
> Após definir os requisitos (consultar config-db.md), dei o comando para iniciar o desenvolvimento do componente de sidebar

## Prompt 3: Ajuste do arquivo de layout
vamos lá, o código atual do layout é esse:
```
# Exemplo
# Não vou colocar o código inteiro para não poluir o documento
```
precisamos adicionar o título também, por enquanto o nome será TasksApp, e a fonte será open-sans

### Incluso na resposta do agente
Se transformarmos o RootLayout inteiro em Client Component, perderemos benefícios de SEO e performance inicial. A solução ideal é manter o layout.tsx como Server Component (para gerenciar as fontes e os metadados) e criar um componente wrapper (como um ClientLayout) para envelopar a aplicação com a Sidebar e a Topbar.

### Tomada de decisão
Segui com a sugestão do agente e criei o componente ClientLayout

## Prompt 4: Ajuste do CSS global
vamos aplicar os temas diretamente no global.css, para termos maior controle nos componentes:
```
# Exemplo
# Não vou colocar o código inteiro para não poluir o documento
```
já me indique também as alterações nos arquivos criados, chamando as variáveis do global para evitar uso de cores hardcoded


## Prompt 5: Correção de modo claro/escuro
Vou deixar os ajustes finos de usabilidade e aparência para depois, porém precisamos resolver um pequeno problema, como a lixeira e tarefas foram criadas como páginas a parte (/tarefas e /lixeira), no fluxo:
selecionar tema -> clicar em tarefas/lixeira
o tema é sobrescrito pelo padrão (claro), como podemos resolver da melhor forma?

### Sugestão do agente
Esse é um comportamento clássico no Next.js! O que está acontecendo é que o estado isDarkMode que criamos vive apenas dentro do componente Sidebar. Quando você navega entre as rotas (/tarefas, /lixeira), o Next.js pode desmontar e remontar partes da árvore de componentes, resetando o estado local para false (claro) e perdendo a classe .dark do HTML.

A melhor forma, e também o padrão da indústria para resolver isso no Next.js (App Router), é usar a biblioteca next-themes. Ela gerencia a persistência no localStorage, sincroniza entre abas e evita aquele "piscar" de tela branca antes do CSS carregar (FOUC).

### Tomada de decisão
Segui com a sugestão do agente e instalei a biblioteca next-themes

## Prompt 5.1: Correção do modo claro/escuro - Agente integrado
quando fui realizar um teste, ao trocar para o modo escuro e tentar trocar entre as abas /lixeira e /tarefas, há uma piscada branca na tela, isso pode ser devido a ainda não existirem (404), ou realmente é um bug visual?

> Após isso o agente criou as páginas temporárias /tarefas e /lixeira, validando que o problema realmente era a não existência das páginas.

## Prompt 6: Criação do componente de topbar
vamos cuidar do componente de topbar primeiro, para completar essa parte da estrutura inicial planejada no rascunho

> Com o componente criado, refatorei a sidebar para remover o botão de menu, que agora está presente na topbar, decidi isso no rascunho pois achei que a usabilidade ficaria melhor,já que o usuário pode escolher se mantém os nomes ou somente os ícones das abas

## Prompt 7: Criação do componente de card
certo, minha ideia é que criemos um componente que possua duas variantes: note e task, visto que a renderização de cada um terá detalhes visuais diferentes.
seria interessante definir o tipo automaticamente de acordo com a página em que o usuário está, pois assim ele pode criar notas ou tarefas somente em suas abas específicas, outro detalhe importante é que podemos usar otimização de atualização da UI para as ações do usuário, ou seja, toda ação que precisa ser refletida no banco, é realizada automaticamente no front, enquanto a requisição ainda está sendo enviada no background para atualizá-lo, vamos prosseguir então?

**Resposta do agente com a criação do componente card**

## Prompts 8, 9, 10: 

### Criação do componente de formulário, atualização da página de notas e página de tarefas com renderização de cards.

>prompts simples de continuidade do desenvolvimento

## Prompt 11: Criação da página de lixeira
>prompt simples de continuidade do desenvolvimento

### Testei a implementação e pedi para adicionar um detalhe de usabilidade
vamos adicionar um botão esvaziar lixeira

## Prompt 12: Criação da funcionalidade de edição de cards
vamos adicionar a opção de editar um card, e vou escolher como diferencial a opção de fixar um card no topo.
depois iremos para os ajustes de usabilidade antes de fazer o deploy


